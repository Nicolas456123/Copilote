import Spinner from './Spinner';

export default function AIBtn({ icon, label, onClick, loading, loadingLabel, color }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-none text-white text-[11px] font-semibold cursor-pointer font-nunito transition-all whitespace-nowrap disabled:opacity-70 disabled:cursor-wait"
      style={{ background: color || "linear-gradient(135deg, #3D405B, #5A5F7A)" }}
    >
      {loading ? <Spinner size={12} /> : <span>{icon}</span>}
      <span>{loading ? (loadingLabel || "…") : label}</span>
    </button>
  );
}
