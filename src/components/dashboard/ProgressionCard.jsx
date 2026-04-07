import Card from '../ui/Card';
import { XP_PER_LEVEL } from '../../lib/constants';

export default function ProgressionCard({ xp, level, xpInLevel, xpProgress }) {
  return (
    <Card>
      <div className="text-xs font-bold text-navy mb-2">🎮 PROGRESSION</div>
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#9B5DE5] to-[#F15BB5] flex items-center justify-center text-white font-extrabold text-lg shrink-0">
          {level}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-navy">Niveau {level}</div>
          <div className="text-[11px] text-gray-400 mb-1">{xpInLevel} / {XP_PER_LEVEL} XP</div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] transition-all duration-600"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="text-[10px] text-gray-400 mt-2">{xp} XP total • +10/habitude • +25/étape • +50/focus • +100/journal</div>
    </Card>
  );
}
