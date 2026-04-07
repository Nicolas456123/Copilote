const API_BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function callAI(system, userMessage) {
  const data = await request("/ai", {
    method: "POST",
    body: JSON.stringify({ system, userMessage }),
  });
  return data.text || "";
}

export async function callAIJSON(system, userMessage) {
  const raw = await callAI(system, userMessage);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}
