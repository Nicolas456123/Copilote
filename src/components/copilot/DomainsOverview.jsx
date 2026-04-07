import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import { DOMAINS } from '../../lib/constants';
import { domainProjects, domainProgress } from '../../utils/progress';

export default function DomainsOverview({ projects }) {
  const navigate = useNavigate();

  return (
    <Card>
      <div className="text-xs font-bold text-navy mb-2.5">📊 VUE D'ENSEMBLE</div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(DOMAINS).map(([key, d]) => {
          const dp = domainProjects(key, projects);
          const pr = domainProgress(key, projects);
          return (
            <div
              key={key}
              onClick={() => navigate("/projets")}
              className="p-3 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
              style={{ background: `${d.color}08`, border: `1px solid ${d.color}20` }}
            >
              <div className="text-xl">{d.icon}</div>
              <div className="text-xs font-bold text-navy mt-1">{d.label}</div>
              <div className="text-[11px] text-gray-400">{dp.length} projet{dp.length > 1 ? "s" : ""}</div>
              {dp.length > 0 && (
                <div className="h-[3px] bg-gray-100 rounded-full mt-1.5">
                  <div className="h-full rounded-full transition-all duration-600" style={{ width: `${pr}%`, background: d.color }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
