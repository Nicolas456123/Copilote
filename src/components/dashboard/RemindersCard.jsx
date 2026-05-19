import { useState } from 'react';
import Card from '../ui/Card';
import { useReminders, REMINDER_TYPES } from '../../hooks/useReminders';
import { requestPermission } from '../../lib/notifications';
import { downloadICS } from '../../lib/icsExport';

function PermissionBanner({ permission, onAsk }) {
  if (permission === 'granted') {
    return (
      <div className="text-[13px] py-1.5 px-2.5 rounded-lg bg-sage/15 text-sage font-semibold mb-2.5">
        ✓ Notifications activées
      </div>
    );
  }
  if (permission === 'denied') {
    return (
      <div className="text-[13px] py-1.5 px-2.5 rounded-lg bg-coral/15 text-coral mb-2.5 leading-relaxed">
        ✗ Notifications bloquées. Active-les dans les réglages du navigateur, puis recharge.
      </div>
    );
  }
  if (permission === 'unsupported') {
    return (
      <div className="text-[13px] py-1.5 px-2.5 rounded-lg bg-gray-100 text-gray-500 mb-2.5">
        Ton navigateur ne supporte pas les notifications.
      </div>
    );
  }
  return (
    <button
      onClick={onAsk}
      className="w-full py-2.5 rounded-xl border-none bg-coral text-white text-[15px] font-semibold cursor-pointer font-nunito mb-2.5"
    >
      🔔 Activer les notifications
    </button>
  );
}

function TypeRow({ type, state, onToggle, onAdd, onRemove }) {
  const [newTime, setNewTime] = useState('');

  const handleAdd = () => {
    if (!newTime) return;
    onAdd(type.id, newTime);
    setNewTime('');
  };

  return (
    <div className="border-t border-gray-100 pt-2.5 mt-2.5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{type.emoji}</span>
          <span className="text-[14px] font-semibold text-navy">{type.label}</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={state.enabled}
            onChange={(e) => onToggle(type.id, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gray-200 peer-checked:bg-sage rounded-full peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
        </label>
      </div>

      {state.enabled && (
        <div className="animate-fade-in">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {state.times.map(t => (
              <div
                key={t}
                className="flex items-center gap-1 py-1 px-2 rounded-lg bg-[#f5f2ee] text-[13px] text-navy font-semibold tabular-nums"
              >
                {t}
                <button
                  onClick={() => onRemove(type.id, t)}
                  className="text-gray-400 hover:text-coral bg-transparent border-none cursor-pointer text-[14px] leading-none"
                  title="Retirer"
                >
                  ×
                </button>
              </div>
            ))}
            {state.times.length === 0 && (
              <div className="text-[12px] text-gray-400 italic">Aucun horaire</div>
            )}
          </div>
          <div className="flex gap-1.5">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="flex-1 text-[13px] py-1 px-2 rounded-lg border border-gray-200 bg-white font-nunito"
            />
            <button
              onClick={handleAdd}
              disabled={!newTime}
              className="px-3 py-1 rounded-lg border-none bg-navy text-white text-[13px] font-semibold cursor-pointer font-nunito disabled:opacity-40"
            >
              + Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RemindersCard() {
  const {
    state, permission, refreshPermission,
    toggleType, addTime, removeTime, testNotification,
  } = useReminders();
  const [open, setOpen] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleAsk = async () => {
    await requestPermission();
    refreshPermission();
  };

  const handleTest = async () => {
    const ok = await testNotification();
    setTestResult(ok ? 'ok' : 'fail');
    setTimeout(() => setTestResult(null), 2500);
  };

  const enabledCount = Object.values(state).filter(s => s.enabled).length;

  return (
    <Card>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer p-0 font-nunito"
      >
        <div className="text-sm font-bold text-coral">🔔 RAPPELS & NOTIFICATIONS</div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-gray-400">
            {enabledCount > 0 ? `${enabledCount} actif${enabledCount > 1 ? 's' : ''}` : 'Aucun'}
          </span>
          <span className="text-gray-400 text-[14px]">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="mt-3 animate-fade-in">
          <PermissionBanner permission={permission} onAsk={handleAsk} />

          {permission === 'granted' && (
            <>
              <button
                onClick={handleTest}
                className="w-full py-2 rounded-xl border border-gray-200 bg-white text-navy text-[14px] font-semibold cursor-pointer font-nunito mb-1"
              >
                🧪 Tester une notification
              </button>
              {testResult === 'ok' && (
                <div className="text-[12px] text-sage text-center mb-2">Envoyée ✓</div>
              )}
              {testResult === 'fail' && (
                <div className="text-[12px] text-coral text-center mb-2">Échec ✗</div>
              )}
            </>
          )}

          {Object.values(REMINDER_TYPES).map(type => (
            <TypeRow
              key={type.id}
              type={type}
              state={state[type.id]}
              onToggle={toggleType}
              onAdd={addTime}
              onRemove={removeTime}
            />
          ))}

          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-[13px] font-bold text-navy mb-1.5">📱 iPhone — rappels fiables</div>
            <div className="text-[12px] text-gray-500 leading-relaxed mb-2">
              Safari ne déclenche pas les notifications web quand l'app est fermée. Exporte tes horaires vers le <b>Calendrier iPhone</b> : il te donnera de vraies notifications natives chaque jour.
            </div>
            <button
              onClick={() => downloadICS(state)}
              disabled={enabledCount === 0}
              className="w-full py-2 rounded-xl border-none bg-sage text-white text-[14px] font-semibold cursor-pointer font-nunito disabled:opacity-40"
            >
              📅 Télécharger pour Calendrier iPhone (.ics)
            </button>
            <div className="text-[12px] text-gray-400 leading-relaxed mt-2">
              Ouvre le fichier sur ton iPhone → Calendrier propose d'ajouter les rappels récurrents. Refais-le si tu changes tes horaires.
            </div>
          </div>

          <div className="mt-3 pt-2 text-[12px] text-gray-400 leading-relaxed border-t border-gray-100">
            Pense aussi à installer l'app : Safari → bouton Partager → "Sur l'écran d'accueil".
          </div>
        </div>
      )}
    </Card>
  );
}
