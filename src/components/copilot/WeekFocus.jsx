import { useNavigate } from 'react-router-dom';
import ProgressRing from '../ui/ProgressRing';
import Card from '../ui/Card';
import { DOMAINS } from '../../lib/constants';
import { getProgress, getNextStep } from '../../utils/progress';

export default function WeekFocus({ focusProjects }) {
  const navigate = useNavigate();

  return (
    <Card>
      <div className="text-xs font-bold text-coral mb-2">
        🎯 FOCUS DE LA SEMAINE
        {focusProjects.length === 0 && (
          <span className="font-normal text-gray-400"> — choisis 2-3 projets dans "Projets"</span>
        )}
      </div>
      {focusProjects.length > 0 ? (
        focusProjects.map(p => {
          const pr = getProgress(p);
          const nx = getNextStep(p);
          return (
            <div
              key={p.id}
              className="flex items-center gap-2.5 py-1.5 cursor-pointer"
              onClick={() => navigate("/projets")}
            >
              <ProgressRing progress={pr} size={36} stroke={3} color={DOMAINS[p.domain]?.color} />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-navy">{DOMAINS[p.domain]?.icon} {p.name}</div>
                {nx && <div className="text-[11px] text-gray-400 truncate">→ {nx.text}</div>}
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-xs text-gray-300 text-center py-2">
          Sélectionne tes priorités dans l'onglet Projets (⭐)
        </div>
      )}
    </Card>
  );
}
