import Card from '../ui/Card';
import { QUICK_LINKS } from '../../lib/constants';

export default function QuickLinks() {
  return (
    <Card>
      <div className="text-sm font-bold text-navy mb-2">🔗 MES OUTILS</div>
      <div className="flex gap-1.5 flex-wrap">
        {QUICK_LINKS.map(l => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-[#f5f2ee] text-navy text-[13px] font-semibold no-underline flex items-center gap-1 hover:bg-[#ebe6df] transition-colors"
          >
            {l.icon} {l.label}
          </a>
        ))}
      </div>
    </Card>
  );
}
