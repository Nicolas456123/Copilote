import { OBJECTIVE } from '../../lib/discipline';

export default function NorthStar() {
  return (
    <div className="bg-gradient-to-br from-navy to-[#5A5F7A] rounded-3xl p-5 text-white shadow-lg">
      <div className="text-[11px] font-bold tracking-[0.22em] uppercase opacity-50 mb-2">
        {OBJECTIVE.eyebrow}
      </div>
      <h1 className="text-[22px] font-extrabold leading-tight mb-1.5">{OBJECTIVE.title}</h1>
      <div className="text-sm font-bold text-sand mb-3">{OBJECTIVE.pillars}</div>
      <p className="text-[14px] leading-relaxed opacity-80">{OBJECTIVE.statement}</p>
    </div>
  );
}
