const API_BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// AI
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

// Init
export async function initDB() {
  return request("/init", { method: "POST" });
}

// Projects
export async function fetchProjects() {
  return request("/projects");
}

export async function createProject(data) {
  return request("/projects", { method: "POST", body: JSON.stringify(data) });
}

export async function updateProject(data) {
  return request("/projects", { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteProjectAPI(id) {
  return request("/projects", { method: "DELETE", body: JSON.stringify({ id }) });
}

// Habits
export async function fetchHabitLog() {
  return request("/habits");
}

export async function toggleHabitAPI(habitId, date, completed) {
  return request("/habits", { method: "POST", body: JSON.stringify({ habitId, date, completed }) });
}

// Journal
export async function fetchJournal() {
  return request("/journal");
}

export async function createJournalEntry(data) {
  return request("/journal", { method: "POST", body: JSON.stringify(data) });
}

// Settings
export async function fetchSettings() {
  return request("/settings");
}

export async function updateSetting(key, value) {
  return request("/settings", { method: "PUT", body: JSON.stringify({ key, value }) });
}

// Streaks
export async function fetchStreak() {
  return request("/streaks");
}

export async function updateStreak(data) {
  return request("/streaks", { method: "PUT", body: JSON.stringify(data) });
}

// Focus
export async function fetchFocusSessions() {
  return request("/focus");
}

export async function saveFocusSession(data) {
  return request("/focus", { method: "POST", body: JSON.stringify(data) });
}

// Weekly Plan
export async function fetchWeeklyPlan() {
  return request("/plan");
}

export async function generateWeeklyPlan() {
  return request("/plan", { method: "POST", body: JSON.stringify({ action: "generate" }) });
}

export async function updateTaskStatus(id, status) {
  return request("/plan", { method: "PUT", body: JSON.stringify({ id, status }) });
}

export async function rescheduleTask(taskId, newDay) {
  return request("/plan", { method: "POST", body: JSON.stringify({ action: "reschedule", taskId, newDay }) });
}
