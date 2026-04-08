import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import MoodCalendar from '../components/journal/MoodCalendar';
import { JOURNAL_QUESTIONS } from '../lib/journalQuestions';
import { MOOD_OPTIONS } from '../lib/constants';

export default function JournalPage() {
  const { entries, todayEntry, createEntry } = useOutletContext();
  const [view, setView] = useState("checkin");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [customTexts, setCustomTexts] = useState({});
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const currentQ = JOURNAL_QUESTIONS[step];
  const totalSteps = JOURNAL_QUESTIONS.length;

  const selectAnswer = (questionId, choice) => {
    setAnswers(prev => ({ ...prev, [questionId]: choice }));
    // Auto-advance after short delay
    setTimeout(() => {
      if (step < totalSteps - 1) setStep(s => s + 1);
    }, 300);
  };

  const setCustom = (questionId, text) => {
    setCustomTexts(prev => ({ ...prev, [questionId]: text }));
    setAnswers(prev => ({ ...prev, [questionId]: { emoji: "✏️", label: text, value: "custom" } }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < totalSteps) return;
    setSaving(true);

    // Map mood from first question
    const moodMap = { en_feu: MOOD_OPTIONS[0], bien: MOOD_OPTIONS[1], fatigue: MOOD_OPTIONS[3] };
    const mood = moodMap[answers.mood?.value] || MOOD_OPTIONS[2];

    // Collect all answers as tags
    const tags = Object.entries(answers).map(([qId, a]) => {
      const q = JOURNAL_QUESTIONS.find(q => q.id === qId);
      return a.value === "custom" ? a.label : `${a.emoji} ${a.label}`;
    });

    // Build custom text from any free-text answers
    const freeTexts = Object.values(customTexts).filter(t => t.trim());
    const customText = freeTexts.join(". ");

    try {
      const entry = await createEntry({ mood, tags, customText });
      setResult(entry);
    } catch {
      setResult(null);
    }
    setSaving(false);
  };

  const resetForm = () => {
    setStep(0);
    setAnswers({});
    setCustomTexts({});
    setResult(null);
  };

  const allAnswered = Object.keys(answers).length >= totalSteps;

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
              <p className="text-[13px] text-navy leading-relaxed">{todayEntry.aiText}</p>
              <button onClick={resetForm} className="mt-3 text-[11px] text-coral bg-none border-none cursor-pointer font-nunito">
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
              <p className="text-[13px] text-navy leading-relaxed">{result.aiText}</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Progress bar */}
              <div className="flex gap-1">
                {JOURNAL_QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{
                      background: i < step ? "#81B29A" : i === step ? "#E07A5F" : "#e5e5e5",
                    }}
                  />
                ))}
              </div>

              {/* Current question */}
              <Card className="animate-fade-in" key={currentQ.id}>
                <div className="text-[10px] font-bold text-gray-400 mb-1">
                  QUESTION {step + 1}/{totalSteps}
                </div>
                <div className="text-base font-bold text-navy mb-4">{currentQ.question}</div>

                <div className="flex flex-col gap-2">
                  {currentQ.choices.map(choice => {
                    const isSelected = answers[currentQ.id]?.value === choice.value;
                    return (
                      <button
                        key={choice.value}
                        onClick={() => selectAnswer(currentQ.id, choice)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer font-nunito text-left transition-all ${
                          isSelected
                            ? "border-coral bg-coral/10 scale-[1.02]"
                            : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                      >
                        <span className="text-2xl">{choice.emoji}</span>
                        <span className="text-sm font-semibold text-navy">{choice.label}</span>
                        {isSelected && <span className="ml-auto text-coral">✓</span>}
                      </button>
                    );
                  })}

                  {/* Option libre */}
                  <div className="mt-1">
                    <input
                      type="text"
                      placeholder="Autre chose ? Écris ici..."
                      value={customTexts[currentQ.id] || ""}
                      onChange={e => setCustom(currentQ.id, e.target.value)}
                      className="w-full p-3 rounded-xl border border-dashed border-gray-200 text-[13px] font-nunito outline-none focus:border-coral transition-colors bg-transparent text-navy placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex gap-2">
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 bg-transparent text-gray-400 text-xs font-semibold cursor-pointer font-nunito"
                  >
                    ← Précédent
                  </button>
                )}
                {step < totalSteps - 1 && answers[currentQ.id] && (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    className="flex-1 py-2.5 rounded-xl border-none bg-navy text-white text-xs font-bold cursor-pointer font-nunito"
                  >
                    Suivant →
                  </button>
                )}
              </div>

              {/* Summary + Submit */}
              {allAnswered && (
                <div className="animate-fade-in">
                  <Card>
                    <div className="text-xs font-bold text-navy mb-2">📋 RÉSUMÉ</div>
                    {JOURNAL_QUESTIONS.map(q => {
                      const a = answers[q.id];
                      if (!a) return null;
                      return (
                        <div key={q.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                          <span className="text-base">{a.emoji}</span>
                          <span className="text-xs text-gray-500 flex-1">{q.question}</span>
                          <span className="text-xs font-semibold text-navy">{a.label}</span>
                        </div>
                      );
                    })}
                  </Card>

                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full mt-3 py-3.5 rounded-2xl border-none bg-gradient-to-r from-coral to-[#c94c30] text-white text-sm font-bold cursor-pointer font-nunito disabled:opacity-60 transition-all hover:shadow-lg"
                  >
                    {saving ? <Spinner size={16} /> : "✨ Reformuler & Sauvegarder"}
                  </button>
                </div>
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
              <p className="text-[13px] text-navy leading-relaxed">{selectedEntry.aiText}</p>
            </Card>
          )}

          {entries.length === 0 && (
            <Card>
              <div className="text-center text-gray-300 py-4 text-[13px]">
                Aucune entrée pour le moment. Fais ton premier check-in !
              </div>
            </Card>
          )}

          {entries.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold text-navy">📖 DERNIÈRES ENTRÉES</div>
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
