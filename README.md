# 🏭 CV Factory — Interfaz de Clasificación de CVs

Interfaz visual en vivo del pipeline de clasificación de currículums: una **fábrica con etapas** donde agentes tipo marcianitos (cartoon, minimalista, paleta oscura) reciben, analizan, registran y rutean cada CV mientras todo ocurre en pantalla.

## El proceso visualizado

| Estación | Agente | Herramienta | Qué hace |
|---|---|---|---|
| 01 · Recepción | 🎧 Marcianito teal | n8n / KNIME | Captura el CV (Formulario, Email, Google Drive) y lo convierte a texto plano (Extract from PDF / CloudConvert / Tika Parser para lotes de 1.000 CVs) |
| 02 · Análisis | 🤓 Marcianito naranja | DeepSeek | Prompt de reclutador → JSON estricto: `score 1–100`, `resumen`, `fortalezas`, `brechas` (vía nodo OpenAI con Base URL `https://api.deepseek.com/v1`) |
| 03 · Registro | 🪪 Marcianito azul | Twenty CRM / Odoo | Crea el registro del candidato con score, contacto y justificación del match |
| 04 · Ruteo | 🧢 Marcianito rosa | n8n If + Cal.com | Score > 80 → email + WhatsApp con link único de Cal.com → webhook de vuelta → estado "Entrevista Agendada". Si no → talent pool o rechazo amable |

## Qué incluye la interfaz

- **Cinta transportadora animada** (SVG): los CVs viajan, hacen cola por estación, se desvían al pad "AGENDADO" o "TALENT POOL".
- **Agentes vivos**: antena pulsante, parpadeo, brazo trabajando, burbujas de diálogo por estación.
- **Panel de control**: inyectar CV, pausa, velocidad (0.5×/1×/2×), auto-inyección, reinicio.
- **Stats en vivo**: en línea, procesados, score medio, aprobados, entrevistas, pool.
- **Terminal de eventos**: log en tiempo real de cada nodo del flujo.
- **Registro de candidatos**: fila expandible con el JSON de DeepSeek (resumen, fortalezas, brechas).
- **Blueprint de la arquitectura**: las 4 etapas con sus artefactos y notas de integración real.

## Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 4
- Animación 100 % SVG + `requestAnimationFrame` (sin librerías extra)

## Correr en local

```bash
npm install
npm run dev        # desarrollo
npm run build      # producción → carpeta dist/
```

## Despliegue

`npm run build` genera `dist/` estático: funciona directo en GitHub Pages, Netlify, Vercel o un VPS (p. ej. Hostinger + Dokploy, igual que Twenty CRM).
