import { NavLink } from 'react-router-dom';

const tabs = [
  { to: "/", icon: "🏠", label: "Accueil" },
  { to: "/habitudes", icon: "✅", label: "Habitudes" },
  { to: "/projets", icon: "📊", label: "Projets" },
  { to: "/focus", icon: "🎯", label: "Focus" },
  { to: "/journal", icon: "📝", label: "Journal" },
];

export default function BottomNav() {
  return (
    <div className="fií bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] px-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] pt-1.5 bg-cream/95 backdrop-blur-xl border-t border-black/5 flex gap-1 z-50">
      {tabs.map(t => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === "/"}
          className={({ isActive }) =>
            `flex-1 py-2 rounded-xl flex flex-col items-center gap-0.5 text-[10px] font-semibold no-underline transition-all ${
              isActive ? "bg-navy text-white" : "bg-transparent text-gray-400"
            }`
          }
        >
          <span className="text-base">{t.icon}</span>
          {t.label}
        </NavLink>
      ))}
    </div>
  );
}
