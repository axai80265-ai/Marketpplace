import { useEffect, useRef, useState } from "react";
import {
  createSim, inject, setSpeed, tick, toggleAuto, togglePause,
  type Sim,
} from "./simulation/engine";
import FactoryScene from "./components/FactoryScene";
import LogPanel from "./components/LogPanel";
import CandidateBoard from "./components/CandidateBoard";
import Blueprint from "./components/Blueprint";

const BTN =
  "inline-flex items-center gap-2 rounded-md border font-mono text-[11.5px] font-semibold tracking-wide px-3.5 py-2 transition-all duration-150 active:translate-y-px cursor-pointer";

function StatTile({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="relative rounded-lg border border-edge bg-panel px-3.5 py-3 overflow-hidden">
      <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r" style={{ background: color }} />
      <p className="font-mono text-[8.5px] tracking-[0.18em] text-fog/80 mb-1">{label}</p>
      <p className="font-display font-bold text-[22px] leading-none text-snow">
        {value}
        {sub && <span className="ml-1 font-mono font-medium text-[9.5px] text-fog/70">{sub}</span>}
      </p>
    </div>
  );
}

export default function App() {
  const simRef = useRef<Sim>(createSim());
  const [, setFrame] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      tick(simRef.current, dt);
      setFrame((f) => f + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const sim = simRef.current;
  const avg = sim.countScore ? Math.round(sim.sumScore / sim.countScore) : "—";
  const throughput = sim.time > 5 ? (sim.finished / sim.time) * 60 : null;

  return (
    <div className="min-h-screen bg-ink text-snow font-body relative overflow-x-clip">
      {/* fondo por capas */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-dots opacity-70" />
        <div className="float-glow absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full bg-teal/[0.05] blur-[110px]" />
        <div className="float-glow absolute -bottom-52 -right-32 w-[560px] h-[560px] rounded-full bg-orange/[0.045] blur-[110px]" style={{ animationDelay: "-8s" }} />
        <div className="absolute top-1/3 right-1/4 w-[380px] h-[380px] rounded-full bg-pinkx/[0.03] blur-[100px]" />
      </div>

      {/* header */}
      <header className="sticky top-0 z-40 border-b border-edge/80 bg-ink/85 backdrop-blur">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 flex items-center gap-4 py-3">
          <div className="w-9 h-9 rounded-lg border border-teal/40 bg-teal/10 grid place-items-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 32 32">
              <path d="M16 9 L16 5" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" />
              <circle cx="16" cy="4.5" r="2" fill="#FB923C" />
              <ellipse cx="16" cy="19" rx="10" ry="9" fill="#2DD4BF" />
              <circle cx="12" cy="18" r="2.3" fill="#0B0E13" />
              <circle cx="20" cy="18" r="2.3" fill="#0B0E13" />
              <path d="M12.5 23.5 Q16 26 19.5 23.5" stroke="#0B0E13" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-[17px] leading-none tracking-tight">FÁBRICA DE TALENTO</p>
            <p className="font-mono text-[9.5px] text-fog mt-1 tracking-[0.14em] truncate">
              PIPELINE DE CLASIFICACIÓN DE CVs · n8n → DEEPSEEK → TWENTY CRM → CAL.COM
            </p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            {throughput !== null && (
              <span className="hidden sm:block font-mono text-[10.5px] text-fog">
                {throughput.toFixed(1)} <span className="text-fog/60">CV/min</span>
              </span>
            )}
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[9.5px] font-semibold tracking-[0.15em] ${
                sim.running ? "border-mint/40 bg-mint/10 text-mint" : "border-amberx/40 bg-amberx/10 text-amberx"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${sim.running ? "bg-mint led-pulse" : "bg-amberx"}`} />
              {sim.running ? "EN MARCHA" : "EN PAUSA"}
            </span>
          </div>
        </div>
      </header>

      <main className="relative max-w-[1440px] mx-auto px-5 md:px-8">
        {/* controles de línea */}
        <div className="flex flex-wrap items-center gap-2.5 py-5">
          <button
            onClick={() => inject(sim)}
            className={`${BTN} bg-teal text-ink border-teal hover:brightness-110 shadow-[0_0_20px_rgba(45,212,191,0.22)]`}
          >
            <svg width="13" height="13" viewBox="0 0 13 13">
              <path d="M6.5 1.5 V11.5 M1.5 6.5 H11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            INYECTAR CV
          </button>
          <button onClick={() => togglePause(sim)} className={`${BTN} border-edge bg-panel text-snow hover:border-fog/50 hover:bg-panel2`}>
            {sim.running ? (
              <svg width="11" height="12" viewBox="0 0 11 12"><rect x="1" y="1" width="3.2" height="10" rx="1" fill="currentColor" /><rect x="6.8" y="1" width="3.2" height="10" rx="1" fill="currentColor" /></svg>
            ) : (
              <svg width="11" height="12" viewBox="0 0 11 12"><path d="M1.5 1 L10 6 L1.5 11 Z" fill="currentColor" /></svg>
            )}
            {sim.running ? "PAUSAR" : "REANUDAR"}
          </button>

          <div className="flex rounded-md border border-edge overflow-hidden">
            {[0.5, 1, 2].map((v) => (
              <button
                key={v}
                onClick={() => setSpeed(sim, v)}
                className={`px-3 py-2 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                  sim.speed === v ? "bg-snow text-ink" : "bg-panel text-fog hover:text-snow"
                }`}
              >
                {v}×
              </button>
            ))}
          </div>

          <button
            onClick={() => toggleAuto(sim)}
            className={`${BTN} border-edge bg-panel hover:border-fog/50 ${sim.auto ? "text-teal" : "text-fog"}`}
          >
            <span className={`relative inline-block w-8 h-[18px] rounded-full transition-colors ${sim.auto ? "bg-teal/80" : "bg-edge"}`}>
              <span
                className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-snow transition-all duration-200"
                style={{ left: sim.auto ? "16px" : "2px" }}
              />
            </span>
            AUTO
          </button>

          <button
            onClick={() => { simRef.current = createSim(); }}
            className={`${BTN} border-edge bg-panel text-fog hover:text-coral hover:border-coral/50`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12">
              <path d="M10.5 6 A4.5 4.5 0 1 1 6 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M6 0 L8.6 1.6 L6 3.2 Z" fill="currentColor" />
            </svg>
            REINICIAR
          </button>

          <span className="ml-auto hidden lg:block font-mono text-[10px] text-fog/60 tracking-wide">
            T+{`${String(Math.floor(sim.time / 60)).padStart(2, "0")}:${String(Math.floor(sim.time % 60)).padStart(2, "0")}`} · TURNO 01
          </span>
        </div>

        {/* escena + panel lateral */}
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px] items-stretch">
          <div className="rounded-xl border border-edge bg-gradient-to-b from-panel/80 to-panel/40 p-3 md:p-4">
            <FactoryScene sim={sim} />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 px-2 pb-1 font-mono text-[10px] text-fog">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-mint" /> &gt;80 → entrevista vía Cal.com</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amberx" /> 55–80 → talent pool</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-coral" /> &lt;55 → rechazo amable</span>
              <span className="ml-auto text-fog/55 hidden md:inline">PASA EL CURSOR SOBRE UNA ESTACIÓN ↓</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 min-h-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-2.5">
              <StatTile label="EN LÍNEA" value={sim.candidates.length} sub="CVs" color="#E9EEF4" />
              <StatTile label="PROCESADOS" value={sim.finished} color="#38BDF8" />
              <StatTile label="SCORE MEDIO" value={avg} sub="/100" color="#FB923C" />
              <StatTile label="APROBADOS >80" value={sim.approvedTotal} color="#34D399" />
              <StatTile label="ENTREVISTAS" value={sim.scheduledTotal} sub="Cal.com" color="#2DD4BF" />
              <StatTile label="POOL / RECHAZO" value={sim.otherTotal} color="#F472B6" />
            </div>
            <div className="flex-1 min-h-[260px] xl:min-h-0">
              <LogPanel sim={sim} />
            </div>
          </div>
        </section>

        {/* registro */}
        <section className="mt-6">
          <CandidateBoard sim={sim} />
        </section>

        {/* blueprint */}
        <div className="mt-16 mb-10">
          <Blueprint />
        </div>
      </main>

      <footer className="relative border-t border-edge/80 mt-4">
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-6 flex flex-wrap items-center gap-3 justify-between">
          <p className="font-mono text-[10px] text-fog/70 tracking-wide">
            SIMULACIÓN VISUAL DEL FLUJO REAL — n8n SELF-HOSTED · DEEPSEEK API · TWENTY CRM · CAL.COM
          </p>
          <p className="font-mono text-[10px] text-fog/50">HOSTINGER + DOKPLOY · CONTROL TOTAL DEL STACK</p>
        </div>
      </footer>
    </div>
  );
}
