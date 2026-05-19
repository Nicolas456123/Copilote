import { leafStats } from './stepTree';

export function getProgress(project) {
  const { total, done } = leafStats(project.steps);
  if (total === 0) return 0;
  return (done / total) * 100;
}

export function getNextStep(project) {
  const walk = (arr) => {
    for (const s of arr || []) {
      if (s.children?.length) {
        const found = walk(s.children);
        if (found) return found;
      } else if (!s.done) {
        return s;
      }
    }
    return null;
  };
  return walk(project.steps);
}

export function domainProgress(domainKey, projects) {
  const dp = projects.filter(p => p.domain === domainKey);
  if (dp.length === 0) return 0;
  return dp.reduce((sum, p) => sum + getProgress(p), 0) / dp.length;
}

export function domainProjects(domainKey, projects) {
  return projects.filter(p => p.domain === domainKey);
}
