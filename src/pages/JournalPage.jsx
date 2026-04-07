import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import MoodSelector from '../components/journal/MoodSelector';
import ReasonTags from '../components/journal/ReasonTags';
import MoodCalendar from '../components/journal/MoodCalendar';

export default function JournalPage() {
  const { entries, todayEntry, createEntry } = useOutletContext();
  const [view, setView] = useState("checkin");
  const [mood, setMood] = useState(null);
  const [tags, setTags] = useState([]);
  const [customText, setCustomText] = useState("");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async () => {
    if (!mood || tags.length === 0) return;
    setSaving(true);
    try {
      const entry = await createEntry({ mood, tags, customText });
      setResult(entry);
    } catch {
      setResult(null);
    }
    setSaving(false);
  };

  const resetForm = () => {
    setMood(null);
    setTags([]);
    setCustomText("");
    setResult(null);
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Tab toggle */}
      <div className="flex gap-1 bg-[#f0ede8] rounded-xl p-1">
        <button
          onClick={() => setView("checkin")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold border-none cursor-pointer font-nunito transition-all ${
            view === "checkin" ? "bg-white text-navy shadow-sm" : "bg-transparent text-gray-400"
          }`}
        >
          📝 Check-in
        </button>
        <button
          onClick={() => setView("history")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold border-none cursor-pointer font-nunito transition-all ${
            view === "history" ? "bg-white text-navy shadow-sm" : "bg-transparent text-gray-400"
          }`}
        >
          📅 Historique
        </button>
      </div>

      {view === "checkin" && (
        <>
          {todayEntry && !result ? (
            <Card>
              <div className="text-xs font-bold text-sage mb-2">✅ CHECK-IN DU JOUR</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{todayEntry.mood.emoji}</span>
                <span className="text-sm font-bold text-navy">{todayEntry.mood.label}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {todayEntry.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-sage/15 text-sage text-[10px] font-semibold">{t}</span>
                ))}
              </div>
              <p className="text-[13px] text-navy leading-relaí">{todayEntry.aiText}</p>
              <button
                onClick={resetForm}
                className="mt-3 text-[11px] text-coral bg-none border-none cursor-pointer font-nunito"
              >
                Refaire le check-in
              </button>
            </Card>
          ) : result ? (
            <Card className="animate-fade-in">
              <div className="text-xs font-bold text-sage mb-2">✨ JOURNAL ENREGISTRÉ</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{result.mood.emoji}</span>
                <span className="text-sm font-bold text-navy">{result.mood.label}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {result.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-sage/15 text-sage text-[10px] font-semibold">{t}</span>
                ))}
              </div>
              <p className="text-[13px] text-navy leading-relaí">{result.aiText}</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              <Card>
                <MoodSelector selected={mood} onSelect={setMood} />
              </Card>

              {mood && (
                <Card className="animate-fade-in">
                  <ReasonTags selected={tags} onToggle={toggleTag} />
                </Card>
              )}

              {mood && tags.length > 0 && (
                <Card className="animate-fade-in">
                  <div className="text-xs font-bold text-navy mb-2">Autre chose ? <span className="font-normal text-gray-400">(optionnel)</span></div>
                  <textarea
                    value={customText}
                    onChange={e => setCustomText(e.target.value)}
                    placeholder="Un mot, une pens\u00E9e, un détail…"
                    maxLength={500}
                    className="w-full p-2.5 rounded-lg border border-gray-200 text-[13px] font-nunito resize-y min-h-[60px] outline-none focus:border-coral transition-colors"
                  />
                  <div className="text-right text-[10px] text-gray-300">{customText.length}/500</div>
                </Card>
              )}

              {mood && tags.length > 0 && (
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full py-3 rounded-2xl border-none bg-gradient-to-r from-coral to-[#c94c30] text-white text-sm font-bold cursor-pointer font-nunito disabled:opacity-60 transition-all hover:shadow-lg animate-fade-in"
                >
                  {saving ? <Spinner size={16} /> : "✨ Reformuler & Sauvegarder"}
                </button>
              )}
            </div>
          )}
        </>
      )}

      {view === "history" && (
        <>
          <MoodCalendar entries={entries} onSelectDate={setSelectedEntry} />

          {selectedEntry && (
            <Card className="animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{selectedEntry.mood.emoji}</span>
                <div>
                  <span className="text-sm font-bold text-navy">{selectedEntry.mood.label}</span>
                  <div className="text-[10px] text-gray-400">
                    {new Date(selectedEntry.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedEntry.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-sage/15 text-sage text-[10px] font-semibold">{t}</span>
                ))}
              </div>
              <p className="text-[13px] text-navy leading-relaí">{selectedEntry.aiText}</p>
            </Card>
          )}

          {entries.length === 0 && (
            <Card>
              <div className="text-center text-gray-300 py-4 text-[13px]">
                Aucune entr\u00E9e pour le moment. Fais ton premier check-in !
              </div>
            </Card>
          )}

          {entries.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold text-navy">📖 DERNIÈRES ENTR\u00C9ES</div>
              {entries.slice(0, 10).map(e => (
                <Card key={e.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedEntry(e)}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{e.mood.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-navy">
                        {new Date(e.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">{e.aiText}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
