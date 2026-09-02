import { useState } from "react";
import { scoreColor, type Candidate, type Sim, type StageId } from "../simulation/engine";

const BADGE: Record<StageId, { t: string; c: string }> = {
  toS1: { t: "EN COLA", c: "#8A97A8" },
  atS1: { t: "EXTRAYENDO", c: "#2DD4BF" },
  toS2: { t: "EN TRÁNSITO", c: "#8A97A8" },
  atS2: { t: "ANALIZANDO", c: "#FB923C" },
  toS3: { t: "EN TRÁNSITO", c: "#8A97A8" },
  atS3: { t: "REGISTRANDO", c: "#38BDF8" },
  toS4: { t: "EN TRÁNSITO", c: "#8A97A8" },
  atS4: { t: "RUTEANDO", c: "#F472B6" },
  routing: { t: "ENVIANDO", c: "#F472B6" },
  done: { t: "LISTO", c: "#8A97A8" },
};

function badgeOf(c: Candidate) {
  if (c.stage === "done") {
    if (c.outcome === "approved") return { t: "AGENDADO", c: "#34D399" };
    if (c.outcome === "talent") return { t: "TALENT POOL", c: "#FBBF24" };
    return { t: "RECHAZADO", c: "#F87171" };
  }
  return BADGE[c.stage];
}

function jsonOf(c: Candidate) {
  return JSON.stringify(
    { score: c.score, resumen: c.summary, fortalezas: c.strengths, brechas: c.gaps },
    null,
    2
  );
}

export default function CandidateBoard({ sim }: { sim: Sim }) {
  const [open, setOpen] = useState<number | null>(null);
  const rows = sim.history.slice(0, 14);

  return (
    <div className="rounded-xl border border-edge bg-panel/70 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-edge">
        <h2 className="font-display font-bold text-lg text-snow tracking-tight">Registro de candidatos</h2>
        <span className="rounded-full border border-edge bg-panel2 px-2.5 py-0.5 font-mono text-[10px] text-fog">
          {sim.history.length} en sesión
        </span>
        <span className="ml-auto hidden md:block font-mono text-[10px] text-fog/60 tracking-wide">
          CLICK EN UNA FILA → JSON DE DEEPSEEK
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[52px_1.5fr_1fr_1.1fr_150px_48px] items-center gap-3 px-5 py-2.5 border-b border-edge bg-panel2/60 font-mono text-[9.5px] tracking-[0.15em] text-fog/70">
            <span>CV</span><span>CANDIDATO</span><span>FUENTE</span><span>SCORE DEEPSEEK</span><span>ESTADO</span><span />
          </div>

          {rows.length === 0 && (
            <p className="px-5 py-8 text-sm text-fog">Aún no hay CVs en la línea…</p>
          )}

          {rows.map((c) => {
            const b = badgeOf(c);
            const isOpen = open === c.id;
            return (
              <div key={c.id} className="row-in border-b border-edge/60 last:border-0">
                <button
                  onClick={() => setOpen(isOpen ? null : c.id)}
                  className="w-full grid grid-cols-[52px_1.5fr_1fr_1.1fr_150px_48px] items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-panel2/70 cursor-pointer"
                >
                  <span className="font-mono text-[11px] text-fog/70">#{String(c.seq).padStart(3, "0")}</span>
                  <span>
                    <span className="block font-display font-semibold text-[13.5px] text-snow leading-tight">{c.name}</span>
                    <span className="block text-[11px] text-fog">{c.role}</span>
                  </span>
                  <span className="font-mono text-[11px] text-fog">{c.source}</span>
                  <span className="flex items-center gap-2.5">
                    {c.scored ? (
                      <>
                        <span className="h-1.5 flex-1 max-w-[90px] rounded-full bg-edge overflow-hidden">
                          <span
                            className="block h-full rounded-full transition-all duration-500"
                            style={{ width: `${c.score}%`, background: scoreColor(c.score) }}
                          />
                        </span>
                        <span className="font-mono text-[12px] font-semibold" style={{ color: scoreColor(c.score) }}>
                          {c.score}
                        </span>
                      </>
                    ) : (
                      <span className="font-mono text-[12px] text-fog/50">···</span>
                    )}
                  </span>
                  <span
                    className="justify-self-start rounded-full border px-2.5 py-1 font-mono text-[9px] font-semibold tracking-wider"
                    style={{ color: b.c, borderColor: `${b.c}55`, background: `${b.c}12` }}
                  >
                    {b.t}
                  </span>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" className="justify-self-end text-fog transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                  >
                    <path d="M3 5 L7 9 L11 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 grid gap-3 lg:grid-cols-[1fr_360px] bg-[#0C1117]">
                    <div className="grid gap-3 sm:grid-cols-3 text-[12px]">
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.15em] text-orange mb-1.5">RESUMEN</p>
                        <p className="text-snow/80 leading-relaxed">{c.summary}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.15em] text-mint mb-1.5">FORTALEZAS</p>
                        <ul className="space-y-1">
                          {c.strengths.map((s) => (
                            <li key={s} className="text-snow/80 flex gap-1.5"><span className="text-mint">+</span>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.15em] text-coral mb-1.5">BRECHAS</p>
                        <ul className="space-y-1">
                          {c.gaps.map((g) => (
                            <li key={g} className="text-snow/80 flex gap-1.5"><span className="text-coral">−</span>{g}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <pre className="rounded-lg border border-edge bg-panel p-3.5 font-mono text-[10.5px] leading-relaxed text-orange/90 overflow-x-auto log-scroll">
                      {jsonOf(c)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
