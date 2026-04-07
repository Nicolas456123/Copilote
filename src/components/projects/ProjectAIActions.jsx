import AIBtn from '../ui/AIBtn';

export default function ProjectAIActions({ project, domainColor, onBreakdown, onAdvice, onReorganize, onUnblock, onCelebrate, isLoading }) {
  return (
    <div className="bg-[#f8f6f3] rounded-lg p-2.5 mb-2.5">
      <div className="text-[10px] font-bold text-navy/40 mb-1.5 tracking-wide">🤖 ACTIONS IA</div>
      <div className="flex gap-1.5 flex-wrap">
        <AIBtn icon="🔪" label="D\u00E9couper" onClick={onBreakdown} loading={isLoading("breakdown")} />
        <AIBtn icon="💡" label="Conseil" onClick={onAdvice} loading={isLoading("advice")} />
        <AIBtn icon="🔄" label="Réorganiser" onClick={onReorganize} loading={isLoading("reorg")} color={`linear-gradient(135deg, ${domainColor}, ${domainColor}cc)`} />
        <AIBtn icon="⚡" label="D\u00E9bloquer" onClick={onUnblock} loading={isLoading("unblock")} color="linear-gradient(135deg, #E07A5F, #c94c30)" />
        <AIBtn icon="🎉" label="Cél\u00E9brer" onClick={onCelebrate} loading={isLoading("celebrate")} color="linear-gradient(135deg, #81B29A, #5a9e80)" />
      </div>
    </div>
  );
}
