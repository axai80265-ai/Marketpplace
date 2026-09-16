import type { Sim } from "../simulation/engine";

export default function LogPanel({ sim }: { sim: Sim }) {
  return (
    <div className="flex flex-col h-full min-h-0 rounded-lg border border-edge bg-[#0C1117] overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-edge bg-panel shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-coral/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amberx/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-mint/80" />
        <span className="ml-1 font-mono text-[11px] text-fog">eventos.log</span>
        <span className="ml-auto font-mono text-[10px] text-fog/60">{sim.logs.length} líneas</span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-[5px] log-scroll min-h-0">
        {sim.logs.map((l) => (
          <div key={l.id} className="log-in flex items-baseline gap-2 text-[11.5px] leading-snug">
            <span className="font-mono text-[10px] text-fog/55 shrink-0">{l.time}</span>
            <span
              className="font-mono text-[9px] font-semibold tracking-wider shrink-0 px-1.5 py-px rounded"
              style={{ color: l.color, background: `${l.color}1A` }}
            >
              {l.tag}
            </span>
            <span className="text-snow/85">{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
