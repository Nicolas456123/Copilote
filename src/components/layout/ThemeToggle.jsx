import { useTheme } from '../../hooks/useTheme';

const LABELS = {
  auto: { icon: '🌓', text: 'Auto', title: 'Suit le système' },
  light: { icon: '☀️', text: 'Jour', title: 'Mode clair' },
  dark: { icon: '🌙', text: 'Nuit', title: 'Mode sombre' },
};

export default function ThemeToggle() {
  const { preference, cycle } = useTheme();
  const meta = LABELS[preference] || LABELS.auto;

  return (
    <button
      onClick={cycle}
      title={meta.title}
      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-2 text-ink text-[12px] font-semibold border-none cursor-pointer font-nunito shadow-sm"
    >
      <span className="text-sm">{meta.icon}</span>
      <span>{meta.text}</span>
    </button>
  );
}
