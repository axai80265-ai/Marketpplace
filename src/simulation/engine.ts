/* ============================================================
   Motor de simulación — Línea de clasificación de CVs
   Estaciones: Recepción(n8n) → Análisis(DeepSeek) → CRM → Cal.com
   ============================================================ */

export type Source = "Formulario" | "Email" | "Google Drive";
export type StageId =
  | "toS1" | "atS1"
  | "toS2" | "atS2"
  | "toS3" | "atS3"
  | "toS4" | "atS4"
  | "routing" | "done";
export type Outcome = "approved" | "talent" | "rejected";
export type Accessory = "headset" | "glasses" | "badge" | "cap";
export type FxKind = "score" | "mail" | "spark";

export interface StationDef {
  x: number;
  name: string;
  short: string;
  tech: string;
  color: string;
  dark: string;
  dur: number;
  accessory: Accessory;
  blurb: string;
}

export interface Candidate {
  id: number;
  seq: number;
  name: string;
  role: string;
  source: Source;
  tokens: number;
  score: number;
  scored: boolean;
  summary: string;
  strengths: string[];
  gaps: string[];
  stage: StageId;
  x: number;
  y: number;
  progress: number;
  outcome?: Outcome;
  routeFromX: number;
  routeFromY: number;
}

export interface Fx {
  id: number;
  kind: FxKind;
  x: number;
  y: number;
  text?: string;
  color: string;
  born: number;
}

export interface LogEntry {
  id: number;
  time: string;
  tag: string;
  color: string;
  msg: string;
}

export interface Sim {
  candidates: Candidate[];
  history: Candidate[];
  doneApproved: Candidate[];
  doneOther: Candidate[];
  fx: Fx[];
  logs: LogEntry[];
  time: number;
  autoAcc: number;
  nextId: number;
  running: boolean;
  auto: boolean;
  speed: number;
  finished: number;
  approvedTotal: number;
  scheduledTotal: number;
  otherTotal: number;
  sumScore: number;
  countScore: number;
}

/* ---------- geometría de la escena ---------- */

export const BELT_Y = 292;
export const PAD_APPROVED = { x: 1128, y: 178 };
export const PAD_OTHER = { x: 1128, y: 362 };

export const STATIONS: StationDef[] = [
  {
    x: 215,
    name: "Recepción y Extracción",
    short: "RECEPCIÓN",
    tech: "n8n · KNIME",
    color: "#2DD4BF",
    dark: "#0F766E",
    dur: 1.7,
    accessory: "headset",
    blurb:
      "n8n captura el CV (formulario, email o Google Drive) y lo convierte a texto plano con Extract from PDF o CloudConvert. Lote histórico de 1.000 CVs: KNIME + nodo Tika Parser.",
  },
  {
    x: 465,
    name: "Análisis y Puntuación",
    short: "ANÁLISIS",
    tech: "DeepSeek",
    color: "#FB923C",
    dark: "#C2410C",
    dur: 2.6,
    accessory: "glasses",
    blurb:
      "n8n envía el texto del CV + la vacante a DeepSeek (HTTP Request / AI Agent) con prompt de reclutador. Devuelve JSON estricto: score 1–100, resumen, fortalezas y brechas.",
  },
  {
    x: 715,
    name: "Registro Centralizado",
    short: "REGISTRO",
    tech: "Twenty CRM",
    color: "#38BDF8",
    dark: "#0369A1",
    dur: 1.5,
    accessory: "badge",
    blurb:
      "El JSON estructurado se convierte en un registro del candidato en Twenty CRM u Odoo: score, correo, teléfono y la justificación del porqué hizo (o no) match.",
  },
  {
    x: 935,
    name: "Filtrado y Agendamiento",
    short: "RUTEO",
    tech: "Cal.com",
    color: "#F472B6",
    dark: "#BE185D",
    dur: 1.9,
    accessory: "cap",
    blurb:
      "Nodo If de n8n: score > 80 → correo + WhatsApp con link único de Cal.com. Si no, base de talentos secundaria o rechazo amable. El webhook de Cal.com devuelve el estado a n8n.",
  },
];

export const PHRASES: string[][] = [
  ["Extrayendo texto…", "PDF → texto plano", "Tika Parser (lote)", "CloudConvert listo"],
  ["Actuando como reclutador…", "Generando JSON estricto…", "score · resumen · brechas", "deepseek-chat responde"],
  ["Creando registro…", "Guardando justificación…", "Score + contacto", "Twenty CRM escribe"],
  ["If score > 80…", "Enviando link Cal.com…", "WhatsApp + correo", "Webhook de vuelta"],
];

/* ---------- datos sintéticos ---------- */

const NAMES = [
  "Valentina Ríos", "Mateo Herrera", "Camila Duarte", "Andrés Vega", "Lucía Paredes",
  "Diego Navarro", "Sofía Márquez", "Javier Ochoa", "Renata Aguilar", "Tomás Ferreyra",
  "Paula Iglesias", "Bruno Salcedo", "Elena Cortés", "Ricardo Palacios", "Marta Juárez",
  "Iván Cabrera", "Julia Espinoza", "Héctor Guzmán", "Ana Beltrán", "Óscar Fuentes",
  "Daniela Reyes", "Pablo Quiroga", "Fernanda Solís", "Emiliano Torres",
];

const ROLES = [
  "Frontend Developer", "Data Analyst", "DevOps Engineer", "Backend Python",
  "ML Engineer", "Product Analyst", "Data Engineer", "QA Automation",
];

const SOURCES: Source[] = ["Formulario", "Email", "Google Drive"];

const STRENGTHS = [
  "SQL avanzado y modelado", "Python + pandas", "React / TypeScript",
  "Automatización ETL", "Inglés C1", "Experiencia en nube (AWS)",
  "Liderazgo de squads", "Portafolio sólido", "Testing automatizado",
  "Comunicación con stakeholders", "Docker y CI/CD", "Storytelling con datos",
];

const GAPS = [
  "Sin experiencia en el sector", "Menos años de los pedidos",
  "Nivel de inglés por confirmar", "Brecha en herramientas cloud",
  "Sin experiencia en equipos ágiles", "Stack parcialmente distinto",
  "Disponibilidad parcial", "Sin certificaciones vigentes",
];

const SUMMARIES = [
  "Perfil analítico con fuerte base técnica y orientación a resultados; encaja con el core de la vacante.",
  "Trayectoria sólida en producto y datos; destaca por automatizar procesos y comunicar hallazgos.",
  "Candidato versátil, rápido para aprender; cumple los requisitos clave con margen de crecimiento.",
  "Experiencia relevante en pipelines y reporting; buen match cultural según el tono del CV.",
];

/* ---------- utilidades ---------- */

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function sampleN<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function clock(t: number): string {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function scoreColor(score: number): string {
  if (score > 80) return "#34D399";
  if (score >= 55) return "#FBBF24";
  return "#F87171";
}

export const TAG_COLORS = {
  sys: "#8A97A8",
  in: "#2DD4BF",
  ai: "#FB923C",
  crm: "#38BDF8",
  route: "#F472B6",
  cal: "#34D399",
};

function pushLog(sim: Sim, tag: string, color: string, msg: string) {
  sim.logs.unshift({ id: sim.nextId++, time: clock(sim.time), tag, color, msg });
  if (sim.logs.length > 80) sim.logs.length = 80;
}

/* ---------- fábrica de candidatos ---------- */

function makeCandidate(id: number): Candidate {
  const score = Math.round(25 + ((Math.random() + Math.random()) / 2) * 73);
  return {
    id,
    seq: id,
    name: pick(NAMES),
    role: pick(ROLES),
    source: pick(SOURCES),
    tokens: 700 + Math.floor(Math.random() * 1800),
    score,
    scored: false,
    summary: pick(SUMMARIES),
    strengths: sampleN(STRENGTHS, 3),
    gaps: sampleN(GAPS, 2 + Math.floor(Math.random() * 2)),
    stage: "toS1",
    x: 58,
    y: BELT_Y,
    progress: 0,
    routeFromX: 0,
    routeFromY: 0,
  };
}

export function inject(sim: Sim) {
  if (sim.candidates.length >= 22) {
    pushLog(sim, "SISTEMA", TAG_COLORS.sys, "Cinta saturada — espera a que fluyan los CVs");
    return;
  }
  const c = makeCandidate(sim.nextId++);
  sim.candidates.push(c);
  sim.history.unshift(c);
  pushLog(sim, "ENTRADA", TAG_COLORS.in, `CV entrante: ${c.name} (${c.role}) vía ${c.source}`);
}

/* ---------- ciclo de vida ---------- */

export function createSim(): Sim {
  const sim: Sim = {
    candidates: [],
    history: [],
    doneApproved: [],
    doneOther: [],
    fx: [],
    logs: [],
    time: 0,
    autoAcc: 0,
    nextId: 1,
    running: true,
    auto: true,
    speed: 1,
    finished: 0,
    approvedTotal: 0,
    scheduledTotal: 0,
    otherTotal: 0,
    sumScore: 0,
    countScore: 0,
  };
  pushLog(sim, "SISTEMA", TAG_COLORS.sys, "Línea 01 en marcha — n8n escuchando webhooks");
  inject(sim);
  inject(sim);
  return sim;
}

const MOVE_TO: StageId[] = ["toS1", "toS2", "toS3", "toS4"];
const AT: StageId[] = ["atS1", "atS2", "atS3", "atS4"];
const SPEED_PX = 132;
const QUEUE_GAP = 58;
const TTL: Record<FxKind, number> = { score: 2.2, mail: 1.7, spark: 1 };

function onArriveStation(sim: Sim, c: Candidate, i: number) {
  if (i === 0) pushLog(sim, "RECEPCIÓN", TAG_COLORS.in, `n8n capturó el CV de ${c.name} → Extract from PDF`);
  if (i === 1) pushLog(sim, "DEEPSEEK", TAG_COLORS.ai, `Prompt de reclutador enviado (${c.name}) · deepseek-chat`);
  if (i === 2) pushLog(sim, "CRM", TAG_COLORS.crm, `Creando registro de ${c.name} en Twenty CRM…`);
  if (i === 3) pushLog(sim, "RUTEO", TAG_COLORS.route, `Switch/If evaluando el score de ${c.name}…`);
}

function finishStation(sim: Sim, c: Candidate, i: number) {
  if (i === 0) {
    c.stage = "toS2";
    c.progress = 0;
    pushLog(sim, "RECEPCIÓN", TAG_COLORS.in, `${c.name}: texto plano listo (${c.tokens} tokens) → cola de análisis`);
  } else if (i === 1) {
    c.scored = true;
    sim.sumScore += c.score;
    sim.countScore++;
    c.stage = "toS3";
    c.progress = 0;
    sim.fx.push({ id: sim.nextId++, kind: "score", x: STATIONS[1].x, y: 200, text: String(c.score), color: scoreColor(c.score), born: sim.time });
    pushLog(sim, "DEEPSEEK", TAG_COLORS.ai, `JSON estricto recibido — score ${c.score}/100 para ${c.name}`);
  } else if (i === 2) {
    c.stage = "toS4";
    c.progress = 0;
    pushLog(sim, "CRM", TAG_COLORS.crm, `Twenty CRM: registro #${4200 + c.id} con score, contacto y justificación`);
  } else {
    c.outcome = c.score > 80 ? "approved" : c.score >= 55 ? "talent" : "rejected";
    c.stage = "routing";
    c.progress = 0;
    c.routeFromX = c.x;
    c.routeFromY = BELT_Y;
    if (c.outcome === "approved") {
      sim.fx.push({ id: sim.nextId++, kind: "mail", x: STATIONS[3].x + 20, y: 230, color: "#F472B6", born: sim.time });
      pushLog(sim, "RUTEO", TAG_COLORS.route, `If score > 80 ✓ → email + WhatsApp con link único de Cal.com (${c.name})`);
    } else if (c.outcome === "talent") {
      pushLog(sim, "RUTEO", TAG_COLORS.route, `Score ${c.score} → ${c.name} pasa a la base de talentos secundaria`);
    } else {
      pushLog(sim, "RUTEO", TAG_COLORS.route, `Score ${c.score} → correo de rechazo amable para ${c.name}`);
    }
  }
}

function arrivePad(sim: Sim, c: Candidate) {
  c.stage = "done";
  sim.candidates = sim.candidates.filter((k) => k.id !== c.id);
  sim.finished++;
  if (c.outcome === "approved") {
    sim.approvedTotal++;
    sim.scheduledTotal++;
    sim.doneApproved.unshift(c);
    if (sim.doneApproved.length > 5) sim.doneApproved.length = 5;
    sim.fx.push({ id: sim.nextId++, kind: "spark", x: PAD_APPROVED.x - 14, y: PAD_APPROVED.y - 30, color: "#34D399", born: sim.time });
    pushLog(sim, "CAL.COM", TAG_COLORS.cal, `Webhook recibido → “${c.name}” en Entrevista Agendada + link Meet`);
  } else {
    sim.otherTotal++;
    sim.doneOther.unshift(c);
    if (sim.doneOther.length > 5) sim.doneOther.length = 5;
  }
}

export function tick(sim: Sim, rawDt: number) {
  if (!sim.running) return;
  const dt = Math.min(rawDt, 0.05) * sim.speed;
  sim.time += dt;

  if (sim.auto && sim.candidates.length < 13) {
    sim.autoAcc += dt;
    if (sim.autoAcc >= 3.4) {
      sim.autoAcc = 0;
      inject(sim);
    }
  }

  for (let i = 0; i < 4; i++) {
    const sx = STATIONS[i].x;
    const targeting = sim.candidates
      .filter((c) => c.stage === MOVE_TO[i] || c.stage === AT[i])
      .sort((a, b) => a.id - b.id);
    let slot = 0;
    for (const c of targeting) {
      if (c.stage === AT[i]) {
        c.progress += dt / STATIONS[i].dur;
        if (c.progress >= 1) finishStation(sim, c, i);
      } else {
        const targetX = sx - slot * QUEUE_GAP;
        const dx = targetX - c.x;
        const step = SPEED_PX * dt;
        if (Math.abs(dx) <= step) {
          c.x = targetX;
          if (slot === 0) {
            c.stage = AT[i];
            c.progress = 0;
            onArriveStation(sim, c, i);
          }
        } else {
          c.x += Math.sign(dx) * step;
        }
      }
      slot++;
    }
  }

  const routing = sim.candidates.filter((c) => c.stage === "routing");
  for (const c of routing) {
    c.progress += dt / 1.35;
    const t = smooth(Math.min(c.progress, 1));
    const approved = c.outcome === "approved";
    const pad = approved ? PAD_APPROVED : PAD_OTHER;
    c.x = lerp(c.routeFromX, pad.x - 6, t);
    c.y = lerp(c.routeFromY, pad.y + (approved ? 4 : 14), t);
    if (c.progress >= 1) arrivePad(sim, c);
  }

  sim.fx = sim.fx.filter((f) => sim.time - f.born < TTL[f.kind]);
}

/* ---------- controles ---------- */

export function togglePause(sim: Sim) {
  sim.running = !sim.running;
  pushLog(sim, "SISTEMA", TAG_COLORS.sys, sim.running ? "Línea reanudada" : "Línea en pausa");
}

export function toggleAuto(sim: Sim) {
  sim.auto = !sim.auto;
  pushLog(sim, "SISTEMA", TAG_COLORS.sys, sim.auto ? "Auto-inyección de CVs activada" : "Auto-inyección desactivada");
}

export function setSpeed(sim: Sim, v: number) {
  sim.speed = v;
}
