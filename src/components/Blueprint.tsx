import type { ReactNode } from "react";

interface Stage {
  num: string;
  title: string;
  tools: string[];
  color: string;
  desc: ReactNode;
  artifact?: ReactNode;
}

const STAGES: Stage[] = [
  {
    num: "01",
    title: "Recepción y Extracción de Textos",
    tools: ["n8n", "KNIME", "Extract from PDF", "CloudConvert", "Tika Parser"],
    color: "#2DD4BF",
    desc: (
      <>
        El candidato sube su CV (PDF o DOCX) por <strong className="text-snow">formulario, email o Google Drive</strong>.
        Si el flujo es en tiempo real, n8n captura el archivo y usa nodos como{" "}
        <em className="text-teal not-italic font-mono text-[12px]">Extract from PDF</em> o la API de CloudConvert para
        pasar todo a texto plano.
      </>
    ),
    artifact: (
      <div className="flex items-start gap-3 rounded-lg border border-teal/30 bg-teal/[0.06] px-4 py-3">
        <span className="font-mono text-[10px] font-semibold text-teal tracking-widest mt-0.5 shrink-0">LOTE</span>
        <p className="text-[12px] leading-relaxed text-snow/80">
          Si un cliente entrega <strong className="text-snow">1.000 CVs históricos</strong> de golpe, se usa KNIME
          (nodo Tika Parser) para leer todos los PDFs/DOCX en lote, convertirlos a una tabla y enviarlos a n8n.
        </p>
      </div>
    ),
  },
  {
    num: "02",
    title: "Análisis y Puntuación",
    tools: ["DeepSeek", "HTTP Request", "AI Agent", "Prompt de reclutador"],
    color: "#FB923C",
    desc: (
      <>
        n8n toma el texto del CV y la descripción de la vacante y se los envía a DeepSeek mediante un nodo{" "}
        <em className="text-orange not-italic font-mono text-[12px]">HTTP Request</em> o el nodo de AI Agent. El prompt
        le pide actuar como reclutador y devolver <strong className="text-snow">estrictamente un JSON</strong> con
        score (1–100), resumen de 3 líneas, fortalezas del match y brechas frente a la vacante.
      </>
    ),
    artifact: (
      <pre className="rounded-lg border border-orange/30 bg-[#0C1117] px-4 py-3.5 font-mono text-[11px] leading-relaxed text-orange/90 overflow-x-auto log-scroll">
{`{
  "score": 87,
  "resumen": "Perfil backend con 6 años en Python…",
  "fortalezas": ["Python", "APIs REST", "SQL"],
  "brechas": ["Sin experiencia en cloud"]
}`}
      </pre>
    ),
  },
  {
    num: "03",
    title: "Registro Centralizado",
    tools: ["Twenty CRM", "Odoo"],
    color: "#38BDF8",
    desc: (
      <>
        n8n toma el JSON estructurado que devolvió DeepSeek y crea un registro del candidato en tu CRM. Allí queda
        guardado su puntaje, correo, teléfono y la <strong className="text-snow">justificación del porqué hizo (o no) match</strong>.
      </>
    ),
    artifact: (
      <div className="flex flex-wrap gap-2">
        {["score", "correo", "teléfono", "justificación del match", "estado del pipeline"].map((f) => (
          <span key={f} className="rounded-md border border-skyx/30 bg-skyx/[0.07] px-2.5 py-1 font-mono text-[10.5px] text-skyx">
            {f}
          </span>
        ))}
      </div>
    ),
  },
  {
    num: "04",
    title: "Filtrado y Agendamiento Automático",
    tools: ["n8n If / Switch", "Cal.com", "Email", "WhatsApp", "Webhook"],
    color: "#F472B6",
    desc: (
      <>
        Un nodo condicional de n8n decide el destino: con score mayor a 80% se envía automáticamente correo y WhatsApp —
        <em className="text-pinkx not-italic"> “¡Tu perfil nos encantó! Haz clic aquí para agendar tu entrevista técnica”</em> —
        con un link que lleva al calendario integrado. Si el score es menor, el CV entra a una base de talentos
        secundaria o recibe un rechazo amable.
      </>
    ),
    artifact: (
      <pre className="rounded-lg border border-pinkx/30 bg-[#0C1117] px-4 py-3.5 font-mono text-[11px] leading-relaxed text-pinkx/90 overflow-x-auto log-scroll">
{`IF (score > 80)
  → correo + WhatsApp + link único de Cal.com
  → Cal.com lee disponibilidad real (Google/Outlook)
  → webhook → n8n → estado "Entrevista Agendada"
  → link Meet/Zoom a candidato y evaluador
ELSE
  → talent pool secundario / rechazo amable`}
      </pre>
    ),
  },
];

export default function Blueprint() {
  return (
    <section className="grid gap-10 lg:grid-cols-[360px_1fr] lg:gap-14">
      {/* columna sticky */}
      <div className="lg:sticky lg:top-24 self-start">
        <p className="font-mono text-[10px] tracking-[0.3em] text-teal mb-3">BLUEPRINT</p>
        <h2 className="font-display font-bold text-3xl md:text-4xl leading-[1.05] tracking-tight text-snow mb-5">
          Arquitectura del clasificador
        </h2>
        <p className="text-[13.5px] leading-relaxed text-fog mb-8">
          Cuatro estaciones encadenadas. Cada marcianito de la línea de arriba es una etapa real del flujo: la misma
          secuencia que ves animada es la que corre en producción entre n8n, DeepSeek, tu CRM y el calendario.
        </p>

        <div className="space-y-4">
          <div className="rounded-xl border border-orange/25 bg-panel p-5">
            <p className="font-display font-semibold text-[14px] text-snow mb-2 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-orange shrink-0">
                <rect x="2" y="2" width="12" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8" cy="8" r="2.4" fill="currentColor" />
              </svg>
              ¿DeepSeek dentro de n8n?
            </p>
            <p className="text-[12px] leading-relaxed text-fog">
              No existe un nodo “DeepSeek”, pero se usa el nodo de <strong className="text-snow">OpenAI (Chat Model)</strong>{" "}
              cambiando la <span className="font-mono text-orange/90">Base URL</span> de la credencial por{" "}
              <span className="font-mono text-orange/90 break-all">https://api.deepseek.com/v1</span> y poniendo tu llave de
              DeepSeek. Funciona perfecto: usan la misma arquitectura de llamadas.
            </p>
          </div>

          <div className="rounded-xl border border-mint/25 bg-panel p-5">
            <p className="font-display font-semibold text-[14px] text-snow mb-2 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="text-mint shrink-0">
                <path d="M8 1.5 L14 4.5 V8 C14 11.5 11.5 13.8 8 14.8 C4.5 13.8 2 11.5 2 8 V4.5 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M5.5 8 L7.3 9.8 L10.8 6.3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Agendamiento self-hosted
            </p>
            <p className="text-[12px] leading-relaxed text-fog">
              Para mantener control total, <strong className="text-snow">Cal.com</strong> (open-source y gratuito) se instala
              en tu VPS de Hostinger con <strong className="text-snow">Dokploy</strong>, igual que Twenty. Cuando el candidato
              agenda, Cal.com dispara un webhook de vuelta a n8n: el estado cambia a{" "}
              <span className="font-mono text-mint/90">“Entrevista Agendada”</span> y se envía el link de Meet/Zoom a ambos lados.
            </p>
          </div>
        </div>
      </div>

      {/* etapas */}
      <ol className="relative border-l border-edge pl-8 md:pl-10 space-y-12">
        {STAGES.map((s) => (
          <li key={s.num} id={`etapa-${Number(s.num)}`} className="relative scroll-mt-28">
            <span
              className="absolute -left-[41px] md:-left-[49px] top-1 w-4 h-4 rounded-full border-2"
              style={{ borderColor: s.color, background: "#0B0E13", boxShadow: `0 0 14px ${s.color}55` }}
            />
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
              <span className="font-display font-bold text-4xl md:text-5xl leading-none" style={{ color: `${s.color}33` }}>
                {s.num}
              </span>
              <h3 className="font-display font-bold text-xl md:text-2xl text-snow tracking-tight">{s.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {s.tools.map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-2.5 py-0.5 font-mono text-[9.5px] tracking-wider"
                  style={{ color: s.color, borderColor: `${s.color}44`, background: `${s.color}0F` }}
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="text-[13.5px] leading-relaxed text-fog max-w-2xl mb-4">{s.desc}</p>
            {s.artifact && <div className="max-w-2xl">{s.artifact}</div>}
          </li>
        ))}
      </ol>
    </section>
  );
}
