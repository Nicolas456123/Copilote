export default function CopilotCard({ aiMsg, aiLoading, askAI, aiPlanWeek }) {
  const buttons = [
    { l: "J'ai la flemme 😮‍💨", p: "J'ai la flemme. Motive-moi en te basant sur mes projets, habitudes et mon pourquoi." },
    { l: "Recentre-moi 🎯", p: "Je me sens dispersé avec tous mes projets. Dis-moi exactement quoi faire maintenant. Sois direct." },
    { l: "Planifier la semaine 📅", p: null },
    { l: "Bravo à moi 🏆", p: "Félicite-moi pour ce que j'ai accompli. Regarde mes habitudes, projets et streak." },
  ];

  return (
    <div className="bg-gradient-to-br from-navy to-[#5A5F7A] rounded-2xl p-4.5 text-white shadow-lg">
      <div className="text-xs font-bold opacity-60 mb-1.5">🤖 COPILOTE IA</div>
      {aiMsg ? (
        <div className="text-[13px] leading-relaxed mb-2.5 animate-fade-in">{aiMsg}</div>
      ) : (
        <div className="text-[13px] opacity-70 mb-2.5">Je connais tous tes projets. Demande-moi ce que tu veux.</div>
      )}
      <div className="flex gap-1.5 flex-wrap">
        {buttons.map(btn => (
          <button
            key={btn.l}
            onClick={() => btn.p ? askAI(btn.p) : aiPlanWeek()}
            disabled={aiLoading}
            className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 text-white text-[11px] font-semibold cursor-pointer font-nunito disabled:opacity-50 hover:bg-white/20 transition-all"
          >
            {btn.l}
          </button>
        ))}
      </div>
    </div>
  );
}
