import { useState } from 'react';
import Card from '../ui/Card';
import { useLucidDream } from '../../hooks/useLucidDream';
import { useLucidTraining } from '../../hooks/useLucidTraining';
import { LUCID_PROGRAM, SLEEP_HYGIENE, REALITY_CHECK_RANKING, ASPY_2017, EXPECTATIONS } from '../../lib/lucidProgram';

const DREAM_SIGN_CATEGORIES = [
  { id: 'inner', label: 'Conscience intérieure' },
  { id: 'action', label: 'Action' },
  { id: 'form', label: 'Forme' },
  { id: 'context', label: 'Contexte' },
];

function RichText({ text }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="flex flex-col gap-2 text-[14px] text-ink leading-relaxed">
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        const isList = lines.every(l => l.startsWith('- ') || l.startsWith('* '));
        const isOrdered = lines.every(l => /^\d+\.\s/.test(l));
        if (isList) {
          return (
            <ul key={i} className="list-disc list-inside flex flex-col gap-0.5 pl-1">
              {lines.map((l, j) => <li key={j}><Inline text={l.replace(/^[-*]\s/, '')} /></li>)}
            </ul>
          );
        }
        if (isOrdered) {
          return (
            <ol key={i} className="list-decimal list-inside flex flex-col gap-0.5 pl-1">
              {lines.map((l, j) => <li key={j}><Inline text={l.replace(/^\d+\.\s/, '')} /></li>)}
            </ol>
          );
        }
        return <p key={i}><Inline text={block} /></p>;
      })}
    </div>
  );
}

function Inline({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} className="text-ink">{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

function WeekSelector({ current, onSelect }) {
  return (
    <div className="flex gap-1 mb-2 overflow-x-auto scrollbar-none">
      {LUCID_PROGRAM.map(w => (
        <button
          key={w.week}
          onClick={() => onSelect(w.week)}
          className={`shrink-0 px-2.5 py-1 rounded-lg text-[12px] font-semibold cursor-pointer font-nunito border-none ${
            w.week === current ? 'bg-navy text-white' : 'bg-surface-2 text-ink-muted'
          }`}
        >
          S{w.week}
        </button>
      ))}
    </div>
  );
}

function DreamSignsSection({ signs, onAdd, onRemove }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('context');

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text, category);
    setText('');
  };

  return (
    <div className="mt-3 pt-3 border-t border-line-soft">
      <div className="text-[13px] font-bold text-ink mb-1.5">🧭 MES DREAM SIGNS ({signs.length})</div>
      {signs.length > 0 && (
        <div className="flex flex-col gap-1 mb-2">
          {signs.map(s => {
            const cat = DREAM_SIGN_CATEGORIES.find(c => c.id === s.category);
            return (
              <div key={s.id} className="flex items-center gap-1.5 text-[13px] py-1 px-2 rounded-lg bg-surface-3">
                <span className="text-[11px] text-coral font-semibold uppercase tracking-wide shrink-0">{cat?.label || s.category}</span>
                <span className="flex-1 text-ink">{s.text}</span>
                <button
                  onClick={() => onRemove(s.id)}
                  className="text-ink-soft hover:text-coral bg-transparent border-none cursor-pointer text-[14px] leading-none"
                  title="Supprimer"
                >×</button>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-1.5">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-[13px] py-1 px-2 rounded-lg border border-line bg-surface font-nunito"
          >
            {DREAM_SIGN_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ex : je suis dans mon école primaire"
            className="flex-1 text-[13px] py-1 px-2 rounded-lg border border-line bg-surface font-nunito"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!text.trim()}
          className="py-1.5 rounded-lg border-none bg-navy text-white text-[13px] font-semibold cursor-pointer font-nunito disabled:opacity-40"
        >
          + Ajouter
        </button>
      </div>
    </div>
  );
}

function KnowledgeBox({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2 border border-line-soft rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left py-2 px-3 bg-surface-2 text-[13px] font-bold text-ink cursor-pointer font-nunito border-none flex justify-between"
      >
        <span>{title}</span>
        <span className="text-ink-muted">{open ? '▾' : '▸'}</span>
      </button>
      {open && <div className="p-3 animate-fade-in">{children}</div>}
    </div>
  );
}

function TaskRow({ task, done, onToggle, count }) {
  const isAuto = !!task.source;
  return (
    <button
      onClick={() => !isAuto && onToggle(task.id)}
      disabled={isAuto}
      className={`w-full flex items-center gap-2 py-2 px-2.5 rounded-lg text-left text-[14px] font-nunito border-none cursor-pointer ${
        done ? 'bg-sage/10' : 'bg-surface-3'
      } ${isAuto ? 'cursor-default' : 'hover:bg-surface-2'}`}
    >
      <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[12px] shrink-0 ${
        done ? 'bg-sage border-sage text-white' : 'bg-surface border-line text-transparent'
      }`}>✓</span>
      <span className={`flex-1 ${done ? 'text-ink' : 'text-ink-muted'}`}>{task.label}</span>
      {count !== undefined && (
        <span className={`text-[12px] font-semibold tabular-nums ${done ? 'text-sage' : 'text-ink-muted'}`}>
          {count}{task.target ? `/${task.target}` : ''}
        </span>
      )}
      {isAuto && count === undefined && (
        <span className="text-[11px] text-ink-muted italic">auto</span>
      )}
    </button>
  );
}

export default function LucidProgramCard() {
  const { checksToday, dreamsToday } = useLucidDream();
  const {
    state, weekData, isTaskDone, tasksDone, tasksTotal, allDoneToday, streak,
    toggleTask, start, setWeek, addDreamSign, removeDreamSign,
  } = useLucidTraining({ checksToday, dreamsToday });
  const [open, setOpen] = useState(false);

  const isOnRCWeek = weekData.week >= 2;
  const isOnDreamSignsWeek = weekData.week >= 3;

  if (!state.started) {
    return (
      <Card>
        <div className="text-sm font-bold text-coral mb-2">🌙 PROGRAMME RÊVE LUCIDE — 6 SEMAINES</div>
        <div className="text-[14px] text-ink leading-relaxed mb-3">
          Un parcours progressif basé sur la recherche (étude Aspy 2017, méthode LaBerge). Chaque semaine ajoute une technique, avec leçon et checklist quotidienne.
        </div>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {LUCID_PROGRAM.map(w => (
            <div key={w.week} className="text-[12px] text-ink py-1.5 px-2 rounded-lg bg-surface-2">
              <div className="font-bold">S{w.week}</div>
              <div className="text-ink-muted">{w.title}</div>
            </div>
          ))}
        </div>
        <button
          onClick={start}
          className="w-full py-2.5 rounded-xl border-none bg-coral text-white text-[15px] font-semibold cursor-pointer font-nunito"
        >
          ▶ Commencer le programme
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer p-0 font-nunito"
      >
        <div className="text-left">
          <div className="text-sm font-bold text-coral">🌙 PROGRAMME — SEMAINE {weekData.week}</div>
          <div className="text-[13px] text-ink mt-0.5">{weekData.title}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[12px] font-semibold ${allDoneToday ? 'text-sage' : 'text-ink-muted'}`}>
            {tasksDone}/{tasksTotal}
          </span>
          {streak > 0 && <span className="text-[12px] text-coral font-semibold">{streak}j 🔥</span>}
          <span className="text-ink-muted text-[14px]">{open ? '▾' : '▸'}</span>
        </div>
      </button>

      {open && (
        <div className="mt-3 animate-fade-in">
          <WeekSelector current={weekData.week} onSelect={setWeek} />

          <div className="text-[13px] text-ink-muted italic mb-2 leading-relaxed">{weekData.focus}</div>

          <div className="text-[12px] font-bold text-coral uppercase mb-1.5 tracking-wide">Aujourd'hui</div>
          <div className="flex flex-col gap-1 mb-2">
            {weekData.dailyTasks.map(task => {
              let count;
              if (task.source === 'rc') count = checksToday;
              else if (task.source === 'dreams') count = dreamsToday.length;
              else if (task.source === 'dreamSigns') count = state.dreamSigns.length;
              return (
                <TaskRow
                  key={task.id}
                  task={task}
                  done={isTaskDone(task)}
                  count={count}
                  onToggle={toggleTask}
                />
              );
            })}
          </div>

          {weekData.tip && (
            <div className="text-[13px] text-ink py-2 px-3 rounded-xl bg-sand/30 mb-2 leading-relaxed">
              💡 <b>Astuce</b> · {weekData.tip}
            </div>
          )}

          <KnowledgeBox title="📖 Leçon complète">
            <RichText text={weekData.lesson} />
          </KnowledgeBox>

          <KnowledgeBox title={`🔗 Sources (${weekData.sources.length})`}>
            <div className="flex flex-col gap-1">
              {weekData.sources.map(s => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-coral underline break-all"
                >
                  → {s.label}
                </a>
              ))}
            </div>
          </KnowledgeBox>

          {isOnDreamSignsWeek && (
            <DreamSignsSection
              signs={state.dreamSigns}
              onAdd={addDreamSign}
              onRemove={removeDreamSign}
            />
          )}

          {isOnRCWeek && (
            <KnowledgeBox title="🎯 Reality checks classés par fiabilité">
              <div className="flex flex-col gap-1.5">
                {REALITY_CHECK_RANKING.map((r, i) => (
                  <div key={r.name} className="text-[13px] py-1.5 px-2 rounded-lg bg-surface-3">
                    <div className="flex justify-between text-ink font-semibold">
                      <span>{i + 1}. {r.name}</span>
                      <span className="text-coral text-[12px]">{r.score}</span>
                    </div>
                    <div className="text-ink-muted text-[12px] leading-relaxed mt-0.5">{r.note}</div>
                  </div>
                ))}
              </div>
            </KnowledgeBox>
          )}

          <KnowledgeBox title="😴 Hygiène de sommeil">
            <RichText text={SLEEP_HYGIENE} />
          </KnowledgeBox>

          <KnowledgeBox title="🔬 Étude Aspy 2017">
            <RichText text={ASPY_2017} />
          </KnowledgeBox>

          <KnowledgeBox title="⏱️ À quoi t'attendre">
            <RichText text={EXPECTATIONS} />
          </KnowledgeBox>

          <div className="text-[12px] text-ink-muted leading-relaxed mt-3 pt-2 border-t border-line-soft">
            Programme inspiré de LaBerge (Lucidity Institute), étude Aspy 2017 (Adélaïde), Cosmic Iron (SSILD). Reste **régulier sur la S1** — c'est la raison #1 d'échec.
          </div>
        </div>
      )}
    </Card>
  );
}
