export function makeStepId(prefix = 's') {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function normalizeStep(s, prefix = 's') {
  return {
    id: s.id || makeStepId(prefix),
    text: s.text || '',
    done: !!s.done,
    children: Array.isArray(s.children) ? s.children.map(c => normalizeStep(c, prefix)) : [],
  };
}

export function normalizeTree(steps) {
  return (steps || []).map(s => normalizeStep(s));
}

export function findStepById(steps, id) {
  for (const s of steps || []) {
    if (s.id === id) return s;
    const found = findStepById(s.children, id);
    if (found) return found;
  }
  return null;
}

export function mapTree(steps, fn) {
  return (steps || []).map(s => {
    const mapped = fn(s);
    return { ...mapped, children: mapTree(mapped.children, fn) };
  });
}

export function updateStepById(steps, id, update) {
  return (steps || []).map(s => {
    if (s.id === id) {
      const updated = typeof update === 'function' ? update(s) : { ...s, ...update };
      return { ...updated, children: updated.children || [] };
    }
    return { ...s, children: updateStepById(s.children, id, update) };
  });
}

export function removeStepById(steps, id) {
  return (steps || [])
    .filter(s => s.id !== id)
    .map(s => ({ ...s, children: removeStepById(s.children, id) }));
}

export function addChildToStep(steps, parentId, child) {
  if (parentId === null) {
    return [...(steps || []), normalizeStep(child)];
  }
  return (steps || []).map(s => {
    if (s.id === parentId) {
      return { ...s, children: [...(s.children || []), normalizeStep(child)] };
    }
    return { ...s, children: addChildToStep(s.children, parentId, child) };
  });
}

export function addChildrenToStep(steps, parentId, children) {
  const normalized = children.map(c => normalizeStep(c));
  if (parentId === null) {
    return [...(steps || []), ...normalized];
  }
  return (steps || []).map(s => {
    if (s.id === parentId) {
      return { ...s, children: [...(s.children || []), ...normalized] };
    }
    return { ...s, children: addChildrenToStep(s.children, parentId, children) };
  });
}

export function replaceChildrenOfStep(steps, parentId, newChildren) {
  const normalized = newChildren.map(c => normalizeStep(c));
  if (parentId === null) {
    return normalized;
  }
  return (steps || []).map(s => {
    if (s.id === parentId) {
      return { ...s, children: normalized };
    }
    return { ...s, children: replaceChildrenOfStep(s.children, parentId, newChildren) };
  });
}

export function leafStats(steps) {
  let total = 0;
  let done = 0;
  const walk = (arr) => {
    for (const s of arr || []) {
      if (!s.children || s.children.length === 0) {
        total++;
        if (s.done) done++;
      } else {
        walk(s.children);
      }
    }
  };
  walk(steps);
  return { total, done };
}

export function isStepFullyDone(step) {
  if (!step.children || step.children.length === 0) return !!step.done;
  return step.children.every(isStepFullyDone);
}

export function flattenForAI(steps, depth = 0) {
  const out = [];
  for (const s of steps || []) {
    out.push({ id: s.id, text: s.text, done: !!s.done, depth });
    if (s.children?.length) out.push(...flattenForAI(s.children, depth + 1));
  }
  return out;
}

export function treeToOutline(steps, depth = 0) {
  const lines = [];
  for (const s of steps || []) {
    const indent = '  '.repeat(depth);
    const mark = s.children?.length ? '▸' : (s.done ? '✓' : '○');
    lines.push(`${indent}${mark} ${s.text}`);
    if (s.children?.length) lines.push(treeToOutline(s.children, depth + 1));
  }
  return lines.join('\n');
}

export function namesToTree(items, idPrefix = 's') {
  if (!Array.isArray(items)) return [];
  return items.map(item => {
    if (typeof item === 'string') {
      return {
        id: makeStepId(idPrefix),
        text: item,
        done: false,
        children: [],
      };
    }
    return {
      id: makeStepId(idPrefix),
      text: item.text || item.name || '',
      done: false,
      children: namesToTree(item.children, idPrefix),
    };
  });
}
