import { DOMAINS } from '../lib/constants';

export function getProgress(project) {
  if (!project.steps || project.steps.length === 0) return 0;
  return (project.steps.filter(s => s.done).length / project.steps.length) * 100;
}

export function getNextStep(project) {
  return project.steps?.find(s => !s.done) || null;
}

export function domainProgress(domainKey, projects) {
  const dp = projects.filter(p => p.domain === domainKey);
  if (dp.length === 0) return 0;
  return dp.reduce((sum, p) => sum + getProgress(p), 0) / dp.length;
}

export function domainProjects(domainKey, projects) {
  return projects.filter(p => p.domain === domainKey);
}
