import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════
// NICOLAS'S LIFE DOMAINS & DEFAULT DATA
// ═══════════════════════════════════════
const DOMAINS = {
  gamedev: { label: "Game Dev", icon: "🎮", color: "#9B5DE5", desc: "Hybelior & Unreal Engine" },
  music: { label: "Musique", icon: "🎵", color: "#F15BB5", desc: "Electro, Orchestral, Pop" },
  work: { label: "Travail", icon: "🏗️", color: "#E07A5F", desc: "BTP & ChantierHub" },
  learning: { label: "Apprentissage", icon: "📚", color: "#00BBF9", desc: "Langues, Sciences, Culture" },
  health: { label: "Santé", icon: "💪", color: "#81B29A", desc: "Sport, Sommeil, Alimentation" },
  daily: { label: "Quotidien", icon: "🏠", color: "#F2CC8F", desc: "Courses, Maison, Admin" },
};

const DEFAULT_PROJECTS = [
  { domain: "gamedev", name: "Hybelior - Jeu vidéo", link: "", steps: [] },
  { domain: "gamedev", name: "Hybelior - Lore & Livre", link: "https://hybelior-world-site.vercel.app/", steps: [] },
  { domain: "music", name: "Falling Again (chanson)", link: "", steps: [] },
  { domain: "music", name: "Productions Electro", link: "", steps: [] },
  { domain: "music", name: "Compositions Orchestrales", link: "", steps: [] },
  { domain: "work", name: "ChantierHub", link: "https://chantierhub.vercel.app", steps: [] },
  { domain: "learning", name: "Curiosita (app)", link: "https://nicolas456123.github.io/Curiosita/", steps: [] },
  { domain: "learning", name: "Apprendre l'Italien", link: "", steps: [] },
  { domain: "learning", name: "Apprendre l'Allemand", link: "", steps: [] },
  { domain: "learning", name: "Code Moto", link: "", steps: [] },
  { domain: "learning", name: "Culture Générale & Sciences", link: "", steps: [] },
  { domain: "health", name: "MiamWeek (alimentation)", link: "https://miamweek.vercel.app", steps: [] },
];

const DEFAULT_HABITS = [
  { id: "wake", label: "Levé 6h-7h", icon: "⏰", domain: "health" },
  { id: "gym", label: "Salle de sport", icon: "🏋️", domain: "health", target: 3, unit: "/sem" },
  { id: "eat", label: "Repas équilibré", icon: "🥗", domain: "health" },
  { id: "learn", label: "Apprendre quelque chose", icon: "📖", domain: "learning" },
  { id: "create", label: "Créer (code/musique/jeu)", icon: "🎨", domain: "gamedev" },
  { id: "sleep", label: "Couché avant 23h", icon: "🌙", domain: "health" },
];

const NICOLAS_CONTEXT = `Tu es le copilote de vie de Nicolas. Il est ingénieur bâtiment (chargé d'affaires BTP) et gère de nombreux projets personnels ambitieux en parallèle de son travail :
- 🎮 Hybelior : un jeu vidéo sur Unreal Engine (avec un site de lore et un livre déjà commencé)
- 🎵 Musique : productions electro, compositions orchestrales, chansons pop (dont "Falling Again") sur FL Studio
- 🏗️ ChantierHub : un outil de gestion de chantier déjà bien avancé
- 📚 Apprentissage : app Curiosita, langues (italien + allemand), code moto, culture générale et sciences
- 💪 Santé : salle de sport 3x/semaine, réveil 6-7h, alimentation (app MiamWeek)
Il se sent souvent débordé et découragé par l'ampleur de tout ça, mais il refuse de lâcher. Il a tendance à s'hyperfocaliser et à se coucher tard. Il a la flemme des corvées. Ton rôle : l'aider à avancer sans se noyer, le motiver, le cadrer, et lui rappeler que chaque petit pas compte. Sois concis (3-5 phrases max), chaleureux, direct. Français. Pas de listes à puces.`;

// ═══════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════
function formatTime(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function getWeekId() {
  const d = new Date(), jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function getTodayKey() { return new Date().toISOString().slice(0, 10); }

async function callClaude(system, userMsg) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages: [{ role: "user", content: userMsg }] }),
  });
  const data = await res.json();
  return data.content?.map(c => c.text || "").join("") || "";
}

async function callClaudeJSON(system, userMsg) {
  const raw = await callClaude(system, userMsg);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

function ProgressRing({ progress, size = 60, stroke = 5, color = "#E07A5F", children }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r, off = circ - (progress / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.22, fontWeight: 700, color: "#3D405B" }}>
        {children || `${Math.round(progress)}%`}
      </div>
    </div>
  );
}

function Spinner({ size = 20 }) {
  return <div style={{ width: size, height: size, border: "3px solid #eee", borderTopColor: "#E07A5F", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />;
}

function AIBtn({ icon, label, onClick, loading, loadingLabel, color }) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{
        padding: "7px 13px", borderRadius: 10, border: "none",
        background: color || "linear-gradient(135deg, #3D405B, #5A5F7A)", color: "white",
        fontSize: 11, fontWeight: 600, cursor: loading ? "wait" : "pointer",
        fontFamily: "inherit", opacity: loading ? 0.7 : 1,
        display: "flex", alignItems: "center", gap: 5, transition: "all 0.2s", whiteSpace: "nowrap",
      }}>
      {loading ? <Spinner size={12} /> : <span>{icon}</span>}
      <span>{loading ? (loadingLabel || "…") : label}</span>
    </button>
  );
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function Copilote() {
  const [tab, setTab] = useState("accueil");
  const [projects, setProjects] = useState([]);
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [habitLog, setHabitLog] = useState({}); // { "2025-01-01": { wake: true, gym: true } }
  const [myWhy, setMyWhy] = useState("");
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [expandedProject, setExpandedProject] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [aiMsg, setAiMsg] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAction, setAiAction] = useState(null);
  const [projMsg, setProjMsg] = useState({});
  const [newStepText, setNewStepText] = useState("");
  const [addingStepTo, setAddingStepTo] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);
  const [showWhyEdit, setShowWhyEdit] = useState(false);
  const [whyDraft, setWhyDraft] = useState("");
  const [focusTask, setFocusTask] = useState(null);
  const [focusTime, setFocusTime] = useState(0);
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusNudge, setFocusNudge] = useState(false);
  const [weekFocus, setWeekFocus] = useState([]); // array of project ids for this week
  const [weekFocusWeek, setWeekFocusWeek] = useState("");
  const timerRef = useRef(null);

  // ─── STORAGE ───
  useEffect(() => {
    (async () => {
      try {
        const keys = ["projects","habitLog","why","streak","lastDate","weekFocus","weekFocusWeek"];
        const results = await Promise.all(keys.map(k => window.storage.get(`cop4:${k}`).catch(() => null)));
        const [p, hl, w, s, d, wf, wfw] = results;
        if (p) setProjects(JSON.parse(p.value));
        else {
          // First launch: initialize with default projects
          const init = DEFAULT_PROJECTS.map((dp, i) => ({ ...dp, id: `init-${i}`, steps: [] }));
          setProjects(init);
        }
        if (hl) setHabitLog(JSON.parse(hl.value));
        if (w) setMyWhy(w.value);
        if (s) setStreak(parseInt(s.value) || 0);
        if (d) setLastDate(d.value);
        if (wf) setWeekFocus(JSON.parse(wf.value));
        if (wfw) setWeekFocusWeek(wfw.value);
      } catch (e) { console.error(e); }
      setLoaded(true);
    })();
  }, []);

  const save = useCallback(async (key, val) => {
    try { await window.storage.set(`cop4:${key}`, typeof val === "string" ? val : JSON.stringify(val)); }
    catch (e) { console.error(e); }
  }, []);

  useEffect(() => { if (loaded) save("projects", projects); }, [projects, loaded]);
  useEffect(() => { if (loaded) save("habitLog", habitLog); }, [habitLog, loaded]);
  useEffect(() => { if (loaded) save("why", myWhy); }, [myWhy, loaded]);
  useEffect(() => { if (loaded) save("streak", String(streak)); }, [streak, loaded]);
  useEffect(() => { if (loaded) save("lastDate", lastDate); }, [lastDate, loaded]);
  useEffect(() => { if (loaded) save("weekFocus", weekFocus); }, [weekFocus, loaded]);
  useEffect(() => { if (loaded) save("weekFocusWeek", weekFocusWeek); }, [weekFocusWeek, loaded]);

  // Streak
  useEffect(() => {
    if (!loaded) return;
    const today = getTodayKey();
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastDate === yesterday) setStreak(s => s + 1);
      else if (lastDate) setStreak(1);
      else setStreak(1);
      setLastDate(today);
    }
    // Reset week focus if new week
    const w = getWeekId();
    if (weekFocusWeek !== w) { setWeekFocus([]); setWeekFocusWeek(w); }
  }, [loaded]);

  // Focus timer
  useEffect(() => {
    if (focusRunning) {
      timerRef.current = setInterval(() => {
        setFocusTime(t => { if (t + 1 === 3600) setFocusNudge(true); return t + 1; });
      }, 1000);
    } else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [focusRunning]);

  // ─── HABITS ───
  const today = getTodayKey();
  const todayHabits = habitLog[today] || {};
  const toggleHabit = (id) => {
    setHabitLog(prev => ({
      ...prev,
      [today]: { ...prev[today], [id]: !prev[today]?.[id] }
    }));
  };
  const habitsToday = habits.filter(h => todayHabits[h.id]).length;
  const habitsTotal = habits.length;
  const habitsProgress = habitsTotal > 0 ? (habitsToday / habitsTotal) * 100 : 0;

  // Weekly gym count
  const getWeekDates = () => {
    const d = new Date(), day = d.getDay(), diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(d); date.setDate(diff + i);
      return date.toISOString().slice(0, 10);
    });
  };
  const weekDates = getWeekDates();
  const gymThisWeek = weekDates.filter(d => habitLog[d]?.gym).length;

  // ─── PROJECTS ───
  const getProgress = (p) => p.steps?.length > 0 ? (p.steps.filter(s => s.done).length / p.steps.length) * 100 : 0;
  const getNext = (p) => p.steps?.find(s => !s.done) || null;

  const addProject = (domain) => {
    if (!newProjectName.trim()) return;
    setProjects(prev => [...prev, { id: Date.now().toString(), domain, name: newProjectName.trim(), steps: [], link: "" }]);
    setNewProjectName(""); setShowAddProject(false);
  };

  const toggleStep = (pid, sid) => {
    setProjects(prev => prev.map(p => p.id === pid ? { ...p, steps: p.steps.map(s => s.id === sid ? { ...s, done: !s.done } : s) } : p));
  };
  const deleteStep = (pid, sid) => {
    setProjects(prev => prev.map(p => p.id === pid ? { ...p, steps: p.steps.filter(s => s.id !== sid) } : p));
  };
  const addManualStep = (pid) => {
    if (!newStepText.trim()) return;
    setProjects(prev => prev.map(p => p.id === pid ? { ...p, steps: [...p.steps, { id: `s${Date.now()}`, text: newStepText.trim(), done: false }] } : p));
    setNewStepText(""); setAddingStepTo(null);
  };
  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (expandedProject === id) setExpandedProject(null);
  };
  const toggleWeekFocus = (id) => {
    setWeekFocus(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  };

  // ─── AI ───
  const SYS_JSON = `Réponds UNIQUEMENT avec un JSON array de strings courtes (max 12 mots chacune). Sans markdown ni backticks.`;
  const isAL = (pid, act) => aiAction === `${pid}:${act}`;

  const aiBreakdown = async (p) => {
    setAiAction(`${p.id}:breakdown`);
    try {
      const names = await callClaudeJSON(SYS_JSON,
        `Découpe ce projet en 5-8 étapes clés concrètes et chronologiques.\nProjet : "${p.name}" (domaine: ${DOMAINS[p.domain]?.label})`);
      const steps = names.map((s, i) => ({ id: `${p.id}-${Date.now()}-${i}`, text: s, done: false }));
      setProjects(prev => prev.map(x => x.id === p.id ? { ...x, steps: [...x.steps, ...steps] } : x));
    } catch { setProjMsg(prev => ({ ...prev, [p.id]: "Erreur, réessaye !" })); }
    setAiAction(null);
  };

  const aiDetailStep = async (p, step) => {
    setAiAction(`${p.id}:detail`);
    try {
      const subs = await callClaudeJSON(SYS_JSON,
        `Découpe cette étape en 3-5 sous-étapes concrètes.\nProjet: "${p.name}"\nÉtape: "${step.text}"`);
      const subSteps = subs.map((s, i) => ({ id: `sub${Date.now()}-${i}`, text: s, done: false }));
      setProjects(prev => prev.map(x => {
        if (x.id !== p.id) return x;
        const idx = x.steps.findIndex(s => s.id === step.id);
        const ns = [...x.steps]; ns.splice(idx + 1, 0, ...subSteps);
        return { ...x, steps: ns };
      }));
    } catch { setProjMsg(prev => ({ ...prev, [p.id]: "Erreur, réessaye !" })); }
    setAiAction(null);
  };

  const aiProjectAction = async (p, action, prompt) => {
    setAiAction(`${p.id}:${action}`);
    try {
      const prog = getProgress(p);
      const done = p.steps.filter(s => s.done).map(s => s.text).join(", ") || "rien";
      const todo = p.steps.filter(s => !s.done).map(s => s.text).join(", ") || "tout fait";
      const text = await callClaude(`${NICOLAS_CONTEXT} Sois concis (3-4 phrases). Pas de listes.`,
        `${prompt}\nProjet: "${p.name}" (${Math.round(prog)}%)\nFait: ${done}\nReste: ${todo}`);
      setProjMsg(prev => ({ ...prev, [p.id]: text }));
    } catch { setProjMsg(prev => ({ ...prev, [p.id]: "Erreur, réessaye !" })); }
    setAiAction(null);
  };

  const aiReorganize = async (p) => {
    setAiAction(`${p.id}:reorg`);
    try {
      const todoSteps = p.steps.filter(s => !s.done).map(s => s.text);
      if (todoSteps.length < 2) { setProjMsg(prev => ({ ...prev, [p.id]: "Rien à réorganiser !" })); setAiAction(null); return; }
      const reordered = await callClaudeJSON(SYS_JSON,
        `Réorganise ces étapes dans l'ordre optimal.\nProjet: "${p.name}"\nÉtapes: ${JSON.stringify(todoSteps)}`);
      const doneSteps = p.steps.filter(s => s.done);
      const newTodo = reordered.map((t, i) => ({ id: `r${Date.now()}-${i}`, text: t, done: false }));
      setProjects(prev => prev.map(x => x.id === p.id ? { ...x, steps: [...doneSteps, ...newTodo] } : x));
      setProjMsg(prev => ({ ...prev, [p.id]: "✅ Réorganisé !" }));
    } catch { setProjMsg(prev => ({ ...prev, [p.id]: "Erreur !" })); }
    setAiAction(null);
  };

  const askAI = async (prompt) => {
    setAiLoading(true); setAiMsg("");
    try {
      const projectsSummary = projects.map(p => {
        const pr = getProgress(p); const nx = getNext(p);
        return `${DOMAINS[p.domain]?.icon} ${p.name} ${Math.round(pr)}%${nx ? ` → ${nx.text}` : ""}`;
      }).join("\n");
      const ctx = `${NICOLAS_CONTEXT}${myWhy ? `\nSon pourquoi : "${myWhy}"` : ""}\nHabitudes aujourd'hui: ${habitsToday}/${habitsTotal} faites. Gym cette semaine: ${gymThisWeek}/3.\nStreak: ${streak}j.\nProjets:\n${projectsSummary}`;
      const text = await callClaude(ctx, prompt);
      setAiMsg(text || "Je suis là 💪");
    } catch { setAiMsg("Continue d'avancer, un pas à la fois. Tu fais déjà beaucoup ! 💪"); }
    setAiLoading(false);
  };

  const aiPlanWeek = async () => {
    setAiLoading(true); setAiMsg("");
    try {
      const projectsSummary = projects.map(p => `${p.name} (${Math.round(getProgress(p))}%)`).join(", ");
      const text = await callClaude(`${NICOLAS_CONTEXT} Sois concis. Propose 2-3 priorités pour cette semaine parmi ses projets, en expliquant pourquoi. Pas de listes à puces.`,
        `Aide-moi à choisir mes priorités de la semaine. Mes projets : ${projectsSummary}. Gym: ${gymThisWeek}/3 cette semaine.`);
      setAiMsg(text);
    } catch { setAiMsg("Choisis 2-3 projets max pour la semaine. Tu ne peux pas tout faire en même temps, et c'est OK !"); }
    setAiLoading(false);
  };

  // ─── HELPERS ───
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 6) return "Tu devrais dormir 😴";
    if (h < 12) return "Bonjour Nicolas ☀️";
    if (h < 18) return "Bon après-midi 💪";
    if (h < 22) return "Bonne soirée 🌙";
    return "Il se fait tard… 🌙";
  };
  const bedtime = (() => {
    const h = new Date().getHours();
    if (h >= 23 || h < 5) return "⚠️ Il est tard ! Pense à dormir.";
    if (h >= 22) return "🌙 Commence à ralentir…";
    return null;
  })();

  const domainProjects = (d) => projects.filter(p => p.domain === d);
  const domainProgress = (d) => {
    const dp = domainProjects(d);
    if (dp.length === 0) return 0;
    return dp.reduce((sum, p) => sum + getProgress(p), 0) / dp.length;
  };

  const tabStyle = (t) => ({
    flex: 1, padding: "8px 0", border: "none", borderRadius: 12,
    background: tab === t ? "#3D405B" : "transparent",
    color: tab === t ? "white" : "#999",
    fontSize: 10, fontWeight: 600, cursor: "pointer",
    transition: "all 0.2s", display: "flex", flexDirection: "column",
    alignItems: "center", gap: 2, fontFamily: "inherit",
  });

  const focusProjects = projects.filter(p => weekFocus.includes(p.id));

  if (!loaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}><Spinner size={32} /></div>;

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", maxWidth: 420, margin: "0 auto", minHeight: "100vh", background: "linear-gradient(180deg, #FFF8F0 0%, #F5F0EB 100%)", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        * { box-sizing: border-box; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "20px 20px 8px", textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#3D405B" }}>{getGreeting()}</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8, flexWrap: "wrap" }}>
          {streak > 0 && (
            <span style={{ background: "linear-gradient(135deg, #F2CC8F, #E07A5F)", color: "white", padding: "3px 12px", borderRadius: 16, fontSize: 12, fontWeight: 700 }}>🔥 {streak}j</span>
          )}
          <span style={{ background: "rgba(129,178,154,0.15)", color: "#81B29A", padding: "3px 12px", borderRadius: 16, fontSize: 12, fontWeight: 700 }}>
            💪 Gym {gymThisWeek}/3
          </span>
          <span style={{ background: "rgba(0,187,249,0.1)", color: "#00BBF9", padding: "3px 12px", borderRadius: 16, fontSize: 12, fontWeight: 700 }}>
            ✅ {habitsToday}/{habitsTotal}
          </span>
        </div>
        {bedtime && <div style={{ marginTop: 8, padding: "8px 14px", borderRadius: 10, background: "rgba(224,122,95,0.12)", color: "#E07A5F", fontSize: 12, fontWeight: 600 }}>{bedtime}</div>}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "0 14px 100px" }}>

        {/* ═══════ ACCUEIL ═══════ */}
        {tab === "accueil" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* AI Coach */}
            <div style={{ background: "linear-gradient(135deg, #3D405B, #5A5F7A)", borderRadius: 18, padding: 18, color: "white", boxShadow: "0 4px 16px rgba(61,64,91,0.2)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.6, marginBottom: 6 }}>🤖 COPILOTE IA</div>
              {aiMsg && <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 10, animation: "fadeIn 0.4s" }}>{aiMsg}</div>}
              {!aiMsg && <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 10 }}>Je connais tous tes projets. Demande-moi ce que tu veux.</div>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { l: "J'ai la flemme 😮‍💨", p: "J'ai la flemme. Motive-moi en te basant sur mes projets, habitudes et mon pourquoi." },
                  { l: "Recentre-moi 🎯", p: "Je me sens dispersé avec tous mes projets. Dis-moi exactement quoi faire maintenant. Sois direct." },
                  { l: "Planifier la semaine 📅", p: null },
                  { l: "Bravo à moi 🏆", p: "Félicite-moi pour ce que j'ai accompli. Regarde mes habitudes, projets et streak." },
                ].map(btn => (
                  <button key={btn.l} onClick={() => btn.p ? askAI(btn.p) : aiPlanWeek()} disabled={aiLoading}
                    style={{
                      padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(255,255,255,0.1)", color: "white",
                      fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                      opacity: aiLoading ? 0.5 : 1,
                    }}>{btn.l}</button>
                ))}
              </div>
            </div>

            {/* Week Focus */}
            <div style={{ background: "white", borderRadius: 18, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E07A5F", marginBottom: 8 }}>🎯 FOCUS DE LA SEMAINE {focusProjects.length === 0 && <span style={{ fontWeight: 400, color: "#999" }}>— choisis 2-3 projets dans "Projets"</span>}</div>
              {focusProjects.length > 0 ? focusProjects.map(p => {
                const pr = getProgress(p); const nx = getNext(p);
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", cursor: "pointer" }}
                    onClick={() => { setTab("projets"); setSelectedDomain(p.domain); setExpandedProject(p.id); }}>
                    <ProgressRing progress={pr} size={36} stroke={3} color={DOMAINS[p.domain]?.color} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#3D405B" }}>{DOMAINS[p.domain]?.icon} {p.name}</div>
                      {nx && <div style={{ fontSize: 11, color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>→ {nx.text}</div>}
                    </div>
                  </div>
                );
              }) : (
                <div style={{ fontSize: 12, color: "#bbb", textAlign: "center", padding: 8 }}>
                  Sélectionne tes priorités dans l'onglet Projets (⭐)
                </div>
              )}
            </div>

            {/* Pourquoi */}
            <div style={{ background: "white", borderRadius: 18, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#E07A5F", marginBottom: 6 }}>🔥 MON POURQUOI</div>
              {showWhyEdit ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <textarea value={whyDraft} onChange={e => setWhyDraft(e.target.value)} placeholder="Pourquoi tu fais tout ça ?"
                    style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd", fontSize: 13, fontFamily: "inherit", resize: "vertical", minHeight: 50 }} />
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setMyWhy(whyDraft); setShowWhyEdit(false); }}
                      style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "#81B29A", color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>OK</button>
                    <button onClick={() => setShowWhyEdit(false)}
                      style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #ddd", background: "transparent", color: "#999", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Annuler</button>
                  </div>
                </div>
              ) : myWhy ? (
                <div onClick={() => { setWhyDraft(myWhy); setShowWhyEdit(true); }} style={{ fontSize: 13, color: "#3D405B", lineHeight: 1.5, cursor: "pointer" }}>"{myWhy}"</div>
              ) : (
                <button onClick={() => { setWhyDraft(""); setShowWhyEdit(true); }}
                  style={{ width: "100%", padding: 10, borderRadius: 10, border: "2px dashed #ddd", background: "transparent", color: "#999", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>+ Définis ton pourquoi</button>
              )}
            </div>

            {/* Domains overview */}
            <div style={{ background: "white", borderRadius: 18, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#3D405B", marginBottom: 10 }}>📊 VUE D'ENSEMBLE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(DOMAINS).map(([key, d]) => {
                  const dp = domainProjects(key);
                  const pr = domainProgress(key);
                  return (
                    <div key={key} onClick={() => { setTab("projets"); setSelectedDomain(key); }}
                      style={{
                        padding: 12, borderRadius: 12, cursor: "pointer",
                        background: `${d.color}08`, border: `1px solid ${d.color}20`,
                        transition: "all 0.2s",
                      }}>
                      <div style={{ fontSize: 20 }}>{d.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#3D405B", marginTop: 4 }}>{d.label}</div>
                      <div style={{ fontSize: 11, color: "#999" }}>{dp.length} projet{dp.length > 1 ? "s" : ""}</div>
                      {dp.length > 0 && (
                        <div style={{ height: 3, background: "#eee", borderRadius: 2, marginTop: 6 }}>
                          <div style={{ height: "100%", width: `${pr}%`, background: d.color, borderRadius: 2, transition: "width 0.6s" }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick links */}
            <div style={{ background: "white", borderRadius: 18, padding: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#3D405B", marginBottom: 8 }}>🔗 MES OUTILS</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { label: "ChantierHub", url: "https://chantierhub.vercel.app", icon: "🏗️" },
                  { label: "Curiosita", url: "https://nicolas456123.github.io/Curiosita/", icon: "📚" },
                  { label: "MiamWeek", url: "https://miamweek.vercel.app", icon: "🥗" },
                  { label: "Hybelior Lore", url: "https://hybelior-world-site.vercel.app/", icon: "🎮" },
                ].map(l => (
                  <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      padding: "6px 12px", borderRadius: 8, background: "#f5f2ee",
                      color: "#3D405B", fontSize: 11, fontWeight: 600, textDecoration: "none",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>{l.icon} {l.label}</a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ HABITUDES ═══════ */}
        {tab === "habitudes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <ProgressRing progress={habitsProgress} size={64} stroke={5} color="#81B29A">
                {habitsToday}/{habitsTotal}
              </ProgressRing>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#3D405B" }}>Habitudes du jour</div>
                <div style={{ fontSize: 12, color: "#999" }}>
                  {habitsProgress === 100 ? "Tout coché ! 🎉" : habitsProgress >= 50 ? "Continue ! 💪" : "Allez, on s'y met !"}
                </div>
              </div>
            </div>

            {habits.map(h => {
              const checked = todayHabits[h.id];
              const d = DOMAINS[h.domain];
              return (
                <div key={h.id} onClick={() => toggleHabit(h.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                    background: checked ? `${d?.color}10` : "white",
                    borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)",
                    cursor: "pointer", transition: "all 0.2s",
                    opacity: checked ? 0.7 : 1,
                  }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    border: `2px solid ${checked ? "#81B29A" : "#ddd"}`,
                    background: checked ? "#81B29A" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontSize: 14, flexShrink: 0,
                  }}>{checked && "✓"}</div>
                  <span style={{ fontSize: 20 }}>{h.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#3D405B", textDecoration: checked ? "line-through" : "none" }}>{h.label}</div>
                    {h.target && <div style={{ fontSize: 11, color: "#999" }}>
                      {h.id === "gym" ? `${gymThisWeek}/${h.target} cette semaine` : `Objectif: ${h.target}${h.unit}`}
                    </div>}
                  </div>
                </div>
              );
            })}

            {/* Week overview */}
            <div style={{ background: "white", borderRadius: 16, padding: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#3D405B", marginBottom: 8 }}>📅 SEMAINE</div>
              <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
                {weekDates.map(d => {
                  const dayHabits = habitLog[d] || {};
                  const count = habits.filter(h => dayHabits[h.id]).length;
                  const isToday = d === today;
                  const dayName = new Date(d).toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 2);
                  return (
                    <div key={d} style={{ textAlign: "center", flex: 1 }}>
                      <div style={{ fontSize: 10, color: isToday ? "#E07A5F" : "#999", fontWeight: isToday ? 800 : 400 }}>{dayName}</div>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", margin: "4px auto",
                        background: count === habitsTotal ? "#81B29A" : count > 0 ? `rgba(129,178,154,${count/habitsTotal})` : "#f5f5f5",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, color: count > 0 ? "white" : "#ccc",
                        border: isToday ? "2px solid #E07A5F" : "none",
                      }}>{count || "·"}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ PROJETS ═══════ */}
        {tab === "projets" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Domain tabs */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
              <button onClick={() => setSelectedDomain(null)}
                style={{
                  padding: "6px 14px", borderRadius: 10, border: "none", whiteSpace: "nowrap",
                  background: !selectedDomain ? "#3D405B" : "#f0ede8",
                  color: !selectedDomain ? "white" : "#999",
                  fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}>Tous</button>
              {Object.entries(DOMAINS).map(([key, d]) => (
                <button key={key} onClick={() => setSelectedDomain(key)}
                  style={{
                    padding: "6px 14px", borderRadius: 10, border: "none", whiteSpace: "nowrap",
                    background: selectedDomain === key ? d.color : "#f0ede8",
                    color: selectedDomain === key ? "white" : "#666",
                    fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                  }}>{d.icon} {d.label}</button>
              ))}
            </div>

            {/* Projects */}
            {(selectedDomain ? [selectedDomain] : Object.keys(DOMAINS)).map(domKey => {
              const dp = domainProjects(domKey);
              if (dp.length === 0 && selectedDomain !== domKey) return null;
              const d = DOMAINS[domKey];
              return (
                <div key={domKey}>
                  {!selectedDomain && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: d.color, margin: "8px 0 6px", display: "flex", alignItems: "center", gap: 6 }}>
                      {d.icon} {d.label}
                    </div>
                  )}
                  {dp.map(p => {
                    const pr = getProgress(p);
                    const isExp = expandedProject === p.id;
                    const isF = weekFocus.includes(p.id);
                    const loading = aiAction?.startsWith(p.id);
                    const msg = projMsg[p.id];
                    const doneC = p.steps?.filter(s => s.done).length || 0;
                    const totalC = p.steps?.length || 0;

                    return (
                      <div key={p.id} style={{
                        background: "white", borderRadius: 14, overflow: "hidden", marginBottom: 8,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                        border: isExp ? `2px solid ${d.color}30` : "1px solid transparent",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", cursor: "pointer" }}
                          onClick={() => setExpandedProject(isExp ? null : p.id)}>
                          <ProgressRing progress={pr} size={44} stroke={3} color={pr === 100 ? "#81B29A" : d.color} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#3D405B", display: "flex", alignItems: "center", gap: 4 }}>
                              {p.name}
                              {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 12, color: "#999" }}>🔗</a>}
                            </div>
                            <div style={{ fontSize: 11, color: "#999" }}>
                              {totalC === 0 ? "Pas encore structuré" : pr === 100 ? "Terminé ! 🎉" : `${doneC}/${totalC} étapes`}
                            </div>
                          </div>
                          <button onClick={e => { e.stopPropagation(); toggleWeekFocus(p.id); }}
                            title={isF ? "Retirer du focus" : "Ajouter au focus semaine"}
                            style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", opacity: isF ? 1 : 0.3, padding: 4 }}>⭐</button>
                          <span style={{ color: "#ccc", fontSize: 16, transform: isExp ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</span>
                        </div>

                        {totalC > 0 && <div style={{ height: 2, background: "#f0f0f0" }}><div style={{ height: "100%", width: `${pr}%`, background: pr === 100 ? "#81B29A" : d.color, transition: "width 0.6s" }} /></div>}

                        {isExp && (
                          <div style={{ padding: "10px 14px 14px", animation: "fadeIn 0.3s" }}>
                            {/* AI Actions */}
                            <div style={{ background: "#f8f6f3", borderRadius: 10, padding: 10, marginBottom: 10 }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: "#3D405B", opacity: 0.4, marginBottom: 6, letterSpacing: 0.5 }}>🤖 ACTIONS IA</div>
                              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                <AIBtn icon="🔪" label="Découper" onClick={() => aiBreakdown(p)} loading={isAL(p.id, "breakdown")} loadingLabel="…" />
                                <AIBtn icon="💡" label="Conseil" onClick={() => aiProjectAction(p, "advice", "Donne-moi un conseil concret pour avancer maintenant.")} loading={isAL(p.id, "advice")} />
                                <AIBtn icon="🔄" label="Réorganiser" onClick={() => aiReorganize(p)} loading={isAL(p.id, "reorg")} color={`linear-gradient(135deg, ${d.color}, ${d.color}cc)`} />
                                <AIBtn icon="⚡" label="Débloquer" onClick={() => aiProjectAction(p, "unblock", "Je bloque. Identifie ce qui coince et propose une solution.")} loading={isAL(p.id, "unblock")} color="linear-gradient(135deg, #E07A5F, #c94c30)" />
                                <AIBtn icon="🎉" label="Célébrer" onClick={() => aiProjectAction(p, "celebrate", "Félicite-moi pour mon avancement !")} loading={isAL(p.id, "celebrate")} color="linear-gradient(135deg, #81B29A, #5a9e80)" />
                              </div>
                            </div>

                            {msg && (
                              <div style={{
                                padding: "10px 12px", borderRadius: 10, marginBottom: 10,
                                background: "linear-gradient(135deg, #3D405B, #5A5F7A)",
                                fontSize: 12, color: "white", lineHeight: 1.5, animation: "fadeIn 0.4s", position: "relative",
                              }}>
                                <button onClick={() => setProjMsg(prev => { const n = { ...prev }; delete n[p.id]; return n; })}
                                  style={{ position: "absolute", top: 4, right: 6, background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 12, cursor: "pointer" }}>×</button>
                                🤖 {msg}
                              </div>
                            )}

                            {loading && <div style={{ textAlign: "center", padding: 12 }}><Spinner size={20} /></div>}

                            {p.steps?.map((step, i) => (
                              <div key={step.id} style={{
                                display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0",
                                borderBottom: i < p.steps.length - 1 ? "1px solid #f5f5f5" : "none",
                              }}>
                                <button onClick={() => toggleStep(p.id, step.id)} style={{
                                  width: 22, height: 22, borderRadius: 5, flexShrink: 0, marginTop: 1,
                                  border: `2px solid ${step.done ? "#81B29A" : "#ddd"}`,
                                  background: step.done ? "#81B29A" : "transparent",
                                  color: "white", fontSize: 11, cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}>{step.done && "✓"}</button>
                                <div style={{ flex: 1, fontSize: 12, color: step.done ? "#aaa" : "#3D405B", textDecoration: step.done ? "line-through" : "none", lineHeight: 1.4, fontWeight: 500 }}>{step.text}</div>
                                <div style={{ display: "flex", gap: 1, flexShrink: 0 }}>
                                  {!step.done && (
                                    <button onClick={() => aiDetailStep(p, step)} disabled={loading} title="Détailler"
                                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 2, opacity: loading ? 0.3 : 0.5 }}>🔍</button>
                                  )}
                                  <button onClick={() => deleteStep(p.id, step.id)} style={{ background: "none", border: "none", color: "#ddd", fontSize: 13, cursor: "pointer", padding: 2 }}>×</button>
                                </div>
                              </div>
                            ))}

                            {p.steps?.length === 0 && !loading && (
                              <div style={{ textAlign: "center", padding: 12, color: "#bbb", fontSize: 12 }}>
                                Clique "🔪 Découper" pour structurer ce projet avec l'IA
                              </div>
                            )}

                            {addingStepTo === p.id ? (
                              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                                <input value={newStepText} onChange={e => setNewStepText(e.target.value)}
                                  placeholder="Nouvelle étape…" onKeyDown={e => e.key === "Enter" && addManualStep(p.id)} autoFocus
                                  style={{ flex: 1, padding: 7, borderRadius: 7, border: "1px solid #eee", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
                                <button onClick={() => addManualStep(p.id)} style={{ padding: "7px 10px", borderRadius: 7, border: "none", background: "#81B29A", color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>OK</button>
                              </div>
                            ) : (
                              <button onClick={() => { setAddingStepTo(p.id); setNewStepText(""); }}
                                style={{ width: "100%", padding: 7, borderRadius: 7, marginTop: 6, border: "1px dashed #ddd", background: "transparent", color: "#999", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>+ Ajouter manuellement</button>
                            )}

                            <button onClick={() => deleteProject(p.id)}
                              style={{ marginTop: 12, padding: 6, border: "none", background: "transparent", color: "#E07A5F", fontSize: 11, cursor: "pointer", fontFamily: "inherit", width: "100%", textAlign: "center", opacity: 0.4 }}>Supprimer</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Add project */}
            {selectedDomain && (
              showAddProject ? (
                <div style={{ display: "flex", gap: 6 }}>
                  <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)}
                    placeholder={`Nouveau projet ${DOMAINS[selectedDomain]?.label}…`}
                    onKeyDown={e => e.key === "Enter" && addProject(selectedDomain)} autoFocus
                    style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #eee", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                  <button onClick={() => addProject(selectedDomain)}
                    style={{ padding: "10px 14px", borderRadius: 10, border: "none", background: DOMAINS[selectedDomain]?.color, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>+</button>
                </div>
              ) : (
                <button onClick={() => setShowAddProject(true)}
                  style={{ padding: 10, borderRadius: 10, border: "2px dashed #ddd", background: "transparent", color: "#999", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>+ Ajouter un projet</button>
              )
            )}
          </div>
        )}

        {/* ═══════ FOCUS ═══════ */}
        {tab === "focus" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center", paddingTop: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#3D405B" }}>Mode Focus</div>
            {!focusTask ? (
              <>
                <div style={{ fontSize: 13, color: "#999", textAlign: "center" }}>Choisis un projet focus et plonge-toi dedans.</div>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
                  {(focusProjects.length > 0 ? focusProjects : projects.slice(0, 6)).flatMap(p =>
                    p.steps?.filter(s => !s.done).slice(0, 2).map(s => (
                      <button key={s.id} onClick={() => { setFocusTask({ ...s, projectName: p.name, domain: p.domain }); setFocusTime(0); setFocusNudge(false); }}
                        style={{
                          padding: "12px 16px", borderRadius: 12, border: "1px solid #eee",
                          background: "white", fontSize: 13, fontWeight: 600, color: "#3D405B",
                          cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                          display: "flex", alignItems: "center", gap: 8,
                        }}>
                        <span>{DOMAINS[p.domain]?.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div>{s.text}</div>
                          <div style={{ fontSize: 10, color: "#999", fontWeight: 400 }}>{p.name}</div>
                        </div>
                      </button>
                    ))
                  )}
                  {projects.every(p => !p.steps || p.steps.every(s => s.done)) && (
                    <div style={{ textAlign: "center", color: "#ccc", padding: 20, fontSize: 13 }}>Structure tes projets d'abord (🔪 Découper)</div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div style={{
                  width: 180, height: 180, borderRadius: "50%",
                  background: focusNudge ? "linear-gradient(135deg, #E07A5F, #F2CC8F)" : `linear-gradient(135deg, ${DOMAINS[focusTask.domain]?.color || "#3D405B"}, #5A5F7A)`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  color: "white", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  animation: focusNudge ? "pulse 2s infinite" : "none",
                }}>
                  <div style={{ fontSize: 32, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{formatTime(focusTime)}</div>
                  <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{focusRunning ? "En cours…" : "En pause"}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#3D405B" }}>{focusTask.text}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>{focusTask.projectName}</div>
                </div>
                {focusNudge && (
                  <div style={{ padding: "10px 16px", borderRadius: 12, background: "rgba(224,122,95,0.1)", color: "#E07A5F", fontSize: 12, fontWeight: 600, textAlign: "center", animation: "pulse 2s infinite" }}>
                    ⏰ 1h ! Fais une pause.
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setFocusRunning(!focusRunning)} style={{
                    padding: "11px 24px", borderRadius: 12, border: "none",
                    background: focusRunning ? "#F2CC8F" : "#81B29A",
                    color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  }}>{focusRunning ? "⏸ Pause" : "▶ Go"}</button>
                  <button onClick={() => { setFocusRunning(false); setFocusTask(null); setFocusTime(0); setFocusNudge(false); }}
                    style={{ padding: "11px 24px", borderRadius: 12, border: "1px solid #ddd", background: "transparent", color: "#999", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Arrêter</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 420,
        padding: "6px 10px 10px", background: "rgba(255,248,240,0.95)",
        backdropFilter: "blur(12px)", borderTop: "1px solid rgba(0,0,0,0.05)",
        display: "flex", gap: 3,
      }}>
        {[
          { id: "accueil", icon: "🏠", label: "Accueil" },
          { id: "habitudes", icon: "✅", label: "Habitudes" },
          { id: "projets", icon: "📊", label: "Projets" },
          { id: "focus", icon: "🎯", label: "Focus" },
        ].map(t => (
          <button key={t.id} style={tabStyle(t.id)} onClick={() => setTab(t.id)}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
