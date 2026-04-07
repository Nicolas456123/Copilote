export default function ProgressRing({ progress, size = 60, stroke = 5, color = "#E07A5F", children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (progress / 100) * circ;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          className="transition-all duration-600"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-navy"
        style={{ fontSize: size * 0.22 }}>
        {children || `${Math.round(progress)}%`}
      </div>
    </div>
  );
}
