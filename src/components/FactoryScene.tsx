import { useState } from "react";
import type { CSSProperties } from "react";
import {
  PHRASES, STATIONS, scoreColor,
  type Sim, type StageId,
} from "../simulation/engine";
import Martian from "./Martian";

const W = 1200;
const H = 430;
const AT: StageId[] = ["atS1", "atS2", "atS3", "atS4"];
const MONO = "IBM Plex Mono, monospace";
const DISPLAY = "Space Grotesk, sans-serif";

const px = (x: number) => `${(x / W) * 100}%`;
const py = (y: number) => `${(y / H) * 100}%`;

const LEG_XS = [140, 340, 540, 740, 940];

export default function FactoryScene({ sim }: { sim: Sim }) {
  const [hover, setHover] = useState<number | null>(null);

  const play: CSSProperties["animationPlayState"] = sim.running ? "running" : "paused";
  const beltDur = `${(0.55 / sim.speed).toFixed(3)}s`;
  const spinDur = `${(1.2 / sim.speed).toFixed(3)}s`;

  const busy = AT.map((st) => sim.candidates.find((c) => c.stage === st));
  const activeSource = (s: string) =>
    sim.candidates.some((c) => c.stage === "toS1" && c.source === s && c.x < 140);
  const routingApproved = sim.candidates.some((c) => c.stage === "routing" && c.outcome === "approved");
  const routingOther = sim.candidates.some((c) => c.stage === "routing" && c.outcome !== "approved");

  return (
    <div className="relative select-none">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto">
        {/* fondo */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M30 0H0V30" fill="none" stroke="#1B232E" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="url(#grid)" opacity="0.5" />
        <text x="40" y="30" fontFamily={MONO} fontSize="10" fill="#8A97A8" opacity="0.65" letterSpacing="2">
          LÍNEA 01 · CLASIFICACIÓN DE CVs · n8n → DeepSeek → Twenty CRM → Cal.com
        </text>

        {/* lámparas colgantes */}
        {STATIONS.map((s, i) => (
          <g key={`lamp-${i}`}>
            <line x1={s.x} y1="0" x2={s.x} y2="24" stroke="#2A3542" strokeWidth="2" />
            <path d={`M${s.x - 8} 22 L${s.x + 8} 22 L${s.x + 15} 36 L${s.x - 15} 36 Z`} fill="#1A222C" stroke="#2A3542" strokeWidth="1.5" />
            <circle cx={s.x} cy="39" r="4" fill={s.color} opacity="0.9" className={sim.running ? "led-pulse" : undefined} style={{ animationDelay: `${i * 0.35}s` }} />
            <path d={`M${s.x - 15} 38 L${s.x + 15} 38 L${s.x + 40} 228 L${s.x - 40} 228 Z`} fill={s.color} opacity="0.035" />
          </g>
        ))}

        {/* soporte de la cinta */}
        {LEG_XS.map((x) => (
          <g key={`leg-${x}`}>
            <rect x={x - 4} y="306" width="8" height="46" fill="#141B23" />
            <rect x={x - 11} y="350" width="22" height="6" rx="3" fill="#1A222C" />
          </g>
        ))}

        {/* cinta transportadora */}
        <rect x="36" y="290" width="968" height="18" rx="9" fill="#0F141B" stroke="#26303C" strokeWidth="1.5" />
        <line
          x1="46" y1="299" x2="994" y2="299"
          stroke="#3E4B5B" strokeWidth="7" strokeDasharray="12 16"
          className="belt-run"
          style={{ animationDuration: beltDur, animationPlayState: play }}
        />
        {/* poleas */}
        {[40, 1000].map((cx) => (
          <g key={`pulley-${cx}`}>
            <circle cx={cx} cy="299" r="11" fill="#1B2430" stroke="#33404E" strokeWidth="2" />
            <circle
              cx={cx} cy="299" r="6" fill="none" stroke="#55657A" strokeWidth="2" strokeDasharray="4 6"
              className="spin" style={{ animationDuration: spinDur, animationPlayState: play }}
            />
          </g>
        ))}

        {/* entrada: bandeja + fuentes */}
        <g>
          <text x="78" y="198" textAnchor="middle" fontFamily={MONO} fontSize="9" fill="#8A97A8" letterSpacing="2">ENTRADA</text>
          {(["Formulario", "Email", "Google Drive"] as const).map((src, i) => {
            const label = src === "Google Drive" ? "DRIVE" : src === "Formulario" ? "FORM" : "MAIL";
            const on = activeSource(src);
            return (
              <g key={src}>
                <rect x={40 + i * 27} y="206" width="24" height="14" rx="7"
                  fill={on ? "#2DD4BF26" : "#10151C"} stroke={on ? "#2DD4BF" : "#2A3542"} strokeWidth="1.2" />
                <text x={52 + i * 27} y="216" textAnchor="middle" fontFamily={MONO} fontSize="6.5"
                  fill={on ? "#2DD4BF" : "#8A97A8"}>{label}</text>
              </g>
            );
          })}
          <rect x="40" y="246" width="76" height="46" rx="6" fill="#121820" stroke="#26303C" strokeWidth="1.5" />
          {[0, 1, 2].map((k) => (
            <g key={k} transform={`translate(${62 + k * 12} ${284 - k * 3}) rotate(${-5 + k * 5})`}>
              <rect x="-9" y="-22" width="18" height="22" rx="2" fill="#DDE5ED" stroke="#8A97A8" strokeWidth="0.8" />
              <rect x="-5" y="-16" width="10" height="1.6" fill="#A9B6C4" />
              <rect x="-5" y="-12" width="8" height="1.6" fill="#A9B6C4" />
            </g>
          ))}
          <path d="M120 292 L146 292 M140 287 L148 292 L140 297" stroke="#3E4B5B" strokeWidth="2" fill="none" />
        </g>

        {/* canaletas de salida */}
        <line x1="1004" y1="293" x2="1082" y2="182"
          stroke={routingApproved ? "#34D399" : "#33404E"} strokeWidth="2" strokeDasharray="5 7" opacity={routingApproved ? 0.9 : 0.7} />
        <line x1="1004" y1="305" x2="1082" y2="356"
          stroke={routingOther ? "#F472B6" : "#33404E"} strokeWidth="2" strokeDasharray="5 7" opacity={routingOther ? 0.9 : 0.7} />

        {/* pads de salida */}
        <g>
          <rect x="1080" y="148" width="96" height="60" rx="10" fill="#0E1A16" stroke="#34D399" strokeOpacity="0.55" strokeWidth="1.5" />
          <rect x="1092" y="158" width="16" height="15" rx="2.5" fill="none" stroke="#34D399" strokeWidth="1.6" />
          <line x1="1092" y1="163" x2="1108" y2="163" stroke="#34D399" strokeWidth="1.6" />
          <line x1="1096" y1="155" x2="1096" y2="160" stroke="#34D399" strokeWidth="1.6" />
          <line x1="1104" y1="155" x2="1104" y2="160" stroke="#34D399" strokeWidth="1.6" />
          <text x="1114" y="167" fontFamily={MONO} fontSize="8.5" fill="#34D399" letterSpacing="1">CAL.COM</text>
          <text x="1128" y="200" textAnchor="middle" fontFamily={MONO} fontSize="9" fill="#34D399" letterSpacing="1.5">AGENDADO</text>
          {sim.doneApproved.map((c, i) => (
            <g key={`da-${c.id}`} transform={`translate(${1122 - i * 8} ${182 - i * 3}) rotate(${-4 - i * 3})`} opacity={1 - i * 0.15}>
              <rect x="-9" y="-22" width="18" height="22" rx="2" fill="#DDE5ED" stroke="#8A97A8" strokeWidth="0.8" />
              <rect x="-11" y="-30" width="22" height="8" rx="4" fill={scoreColor(c.score)} />
              <text x="0" y="-24" textAnchor="middle" fontFamily={MONO} fontSize="6" fontWeight="700" fill="#0B0E13">{c.score}</text>
            </g>
          ))}
        </g>
        <g>
          <rect x="1080" y="332" width="96" height="60" rx="10" fill="#171219" stroke="#F472B6" strokeOpacity="0.45" strokeWidth="1.5" />
          <text x="1128" y="356" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fill="#F472B6" letterSpacing="1.5">TALENT POOL</text>
          <text x="1128" y="382" textAnchor="middle" fontFamily={MONO} fontSize="8" fill="#8A97A8" letterSpacing="1">RECHAZO AMABLE</text>
          {sim.doneOther.map((c, i) => (
            <g key={`do-${c.id}`} transform={`translate(${1122 - i * 8} ${376 - i * 3}) rotate(${4 + i * 3})`} opacity={1 - i * 0.15}>
              <rect x="-8" y="-19" width="16" height="19" rx="2" fill="#C9D3DD" stroke="#8A97A8" strokeWidth="0.8" />
            </g>
          ))}
        </g>

        {/* estaciones: consola + marcianito + rótulo */}
        {STATIONS.map((s, i) => {
          const b = busy[i];
          const chipW = s.tech.length * 6.4 + 18;
          return (
            <g key={`st-${i}`}>
              <g
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => document.getElementById(`etapa-${i + 1}`)?.scrollIntoView({ behavior: "smooth" })}
                style={{ cursor: "pointer" }}
              >
                {/* halo al pasar el cursor */}
                <rect x={s.x - 60} y="96" width="120" height="212" rx="12"
                  fill={s.color} opacity={hover === i ? 0.05 : 0} style={{ transition: "opacity .2s" }} />
                {/* marcianito */}
                <g transform={`translate(${s.x} 178)`}>
                  <Martian color={s.color} dark={s.dark} accessory={s.accessory} working={!!b && sim.running} delay={i * 0.9} />
                </g>
                {/* consola */}
                <rect x={s.x - 56} y="230" width="112" height="62" rx="8" fill="#131A22" stroke="#2A3542" strokeWidth="1.5" />
                <rect x={s.x - 56} y="230" width="112" height="4" rx="2" fill={s.color} opacity="0.25" />
                <circle cx={s.x - 44} cy="230" r="9" fill={s.color} />
                <text x={s.x - 44} y="233.5" textAnchor="middle" fontFamily={DISPLAY} fontSize="10" fontWeight="700" fill="#0B0E13">{i + 1}</text>
                <circle cx={s.x + 44} cy="240" r="3.5" fill={b ? s.color : "#2A3542"} className={b ? "led-pulse" : undefined} />
                {/* pantalla */}
                <rect x={s.x - 42} y="240" width="84" height="30" rx="4" fill="#0A0E13" stroke={s.color} strokeOpacity="0.35" strokeWidth="1.2" />
                <text x={s.x - 36} y="252" fontFamily={MONO} fontSize="7.5" fill={s.color} opacity={b ? 1 : 0.45} letterSpacing="1">
                  {b ? "PROCESANDO" : "IDLE"}
                </text>
                <rect x={s.x - 38} y="258" width="76" height="5" rx="2.5" fill="#1E2833" />
                {b && (
                  <rect x={s.x - 38} y="258" width={Math.max(2, 76 * Math.min(b.progress, 1))} height="5" rx="2.5" fill={s.color} />
                )}
                {/* rótulo */}
                <text x={s.x} y="332" textAnchor="middle" fontFamily={DISPLAY} fontSize="13.5" fontWeight="600" fill="#E9EEF4">
                  {`${i + 1}. ${s.name}`}
                </text>
                <rect x={s.x - chipW / 2} y="341" width={chipW} height="18" rx="9" fill={s.color} fillOpacity="0.1" stroke={s.color} strokeOpacity="0.4" strokeWidth="1" />
                <text x={s.x} y="353.5" textAnchor="middle" fontFamily={MONO} fontSize="9" fill={s.color} letterSpacing="1">{s.tech}</text>
              </g>
            </g>
          );
        })}

        {/* documentos en la cinta */}
        {sim.candidates.map((c) => {
          const moving = c.stage.startsWith("to") || c.stage === "routing";
          const scanning = c.stage === "atS2";
          return (
            <g key={c.id} transform={`translate(${c.x.toFixed(1)} ${c.y.toFixed(1)})`}>
              <g className={moving && sim.running ? "doc-bob" : undefined}>
                <rect x="-13" y="-30" width="26" height="30" rx="3" fill="#EDF2F7" stroke="#8A97A8" strokeWidth="1.2" />
                <path d="M5 -30 L13 -22 L5 -22 Z" fill="#C4CFDA" />
                <rect x="-8" y="-19" width="16" height="2" rx="1" fill="#A9B6C4" />
                <rect x="-8" y="-14" width="12" height="2" rx="1" fill="#A9B6C4" />
                <rect x="-8" y="-9" width="14" height="2" rx="1" fill="#A9B6C4" />
                {scanning && (
                  <rect x="-12" y={-29 + ((sim.time * 26) % 27)} width="24" height="2.4" fill="#FB923C" opacity="0.85" />
                )}
                {c.scored && (
                  <g>
                    <rect x="-17" y="-47" width="34" height="15" rx="7.5" fill={scoreColor(c.score)} />
                    <text x="0" y="-36.5" textAnchor="middle" fontFamily={MONO} fontSize="9.5" fontWeight="700" fill="#0B0E13">{c.score}</text>
                  </g>
                )}
              </g>
            </g>
          );
        })}
      </svg>

      {/* ---- overlays HTML ---- */}

      {/* burbujas de trabajo */}
      {busy.map((c, i) =>
        c ? (
          <div
            key={`bubble-${i}-${Math.floor(sim.time / 0.9)}`}
            className="bubble-in absolute pointer-events-none z-10"
            style={{ left: px(STATIONS[i].x), top: py(96), transform: "translate(-50%, -100%)" }}
          >
            <div className="bubble-box" style={{ "--bc": STATIONS[i].color } as CSSProperties}>
              <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0" style={{ background: STATIONS[i].color }} />
              {PHRASES[i][Math.floor(sim.time / 0.9) % PHRASES[i].length]}
            </div>
          </div>
        ) : null
      )}

      {/* efectos */}
      {sim.fx.map((f) => {
        const style = { left: px(f.x), top: py(f.y) };
        if (f.kind === "score") {
          return (
            <div key={f.id} className="fx-score absolute pointer-events-none z-20" style={style}>
              <span
                className="inline-block rounded-lg px-2.5 py-1 font-mono text-[13px] font-semibold"
                style={{ background: f.color, color: "#0B0E13", boxShadow: `0 0 22px ${f.color}66` }}
              >
                {f.text}/100
              </span>
            </div>
          );
        }
        if (f.kind === "mail") {
          return (
            <div key={f.id} className="fx-mail absolute pointer-events-none z-20" style={style}>
              <svg width="26" height="20" viewBox="0 0 26 20">
                <rect x="1" y="1" width="24" height="18" rx="3" fill="#131A22" stroke="#F472B6" strokeWidth="1.5" />
                <path d="M2 3 L13 12 L24 3" fill="none" stroke="#F472B6" strokeWidth="1.5" />
              </svg>
            </div>
          );
        }
        return (
          <div key={f.id} className="fx-spark absolute pointer-events-none z-20" style={style}>
            <span className="block w-10 h-10 rounded-full border-2" style={{ borderColor: f.color }} />
          </div>
        );
      })}

      {/* tooltip de estación */}
      {hover !== null && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{ left: px(STATIONS[hover].x), top: py(214), transform: "translate(-50%, 0)" }}
        >
          <div className="w-64 rounded-lg border bg-[#0E131Af5] p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]" style={{ borderColor: STATIONS[hover].color }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: STATIONS[hover].color }} />
              <span className="font-display font-semibold text-[13px] text-snow">{`${hover + 1}. ${STATIONS[hover].name}`}</span>
            </div>
            <span
              className="inline-block rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-wider mb-2"
              style={{ color: STATIONS[hover].color, borderColor: `${STATIONS[hover].color}66`, background: `${STATIONS[hover].color}14` }}
            >
              {STATIONS[hover].tech}
            </span>
            <p className="text-[11.5px] leading-relaxed text-fog">{STATIONS[hover].blurb}</p>
            <p className="mt-2 font-mono text-[9px] text-fog/60 tracking-wide">CLICK → VER BLUEPRINT ↓</p>
          </div>
        </div>
      )}
    </div>
  );
}
