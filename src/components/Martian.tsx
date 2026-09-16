import type { Accessory } from "../simulation/engine";

interface Props {
  color: string;
  dark: string;
  accessory: Accessory;
  working: boolean;
  delay: number;
}

/* Marcianito trabajador — dibujado centrado en (0,0) como centro de cabeza.
   Pies en y≈58. Se coloca con translate(stationX, 178). */
export default function Martian({ color, dark, accessory, working, delay }: Props) {
  return (
    <g>
      {/* antena */}
      <path d="M0 -42 C 3 -52 -4 -58 0 -66" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="0" cy="-70" r="5.5" fill={color} className="antenna-pulse" style={{ animationDelay: `${delay}s` }} />

      {/* cabeza */}
      <ellipse cx="0" cy="-16" rx="30" ry="27" fill={color} stroke={dark} strokeWidth="2.5" />
      <ellipse cx="0" cy="-12" rx="23" ry="18" fill="#ffffff" opacity="0.16" />

      {/* ojos */}
      <g className="eye-blink" style={{ animationDelay: `${delay * 1.7}s` }}>
        <ellipse cx="-10" cy="-16" rx="6.5" ry="8" fill="#F4F8FB" />
        <ellipse cx="10" cy="-16" rx="6.5" ry="8" fill="#F4F8FB" />
        <circle cx="-11.5" cy="-13.5" r="3" fill="#10202B" />
        <circle cx="8.5" cy="-13.5" r="3" fill="#10202B" />
        <circle cx="-12.5" cy="-14.8" r="1" fill="#ffffff" />
        <circle cx="7.5" cy="-14.8" r="1" fill="#ffffff" />
      </g>

      {/* boca */}
      {working ? (
        <ellipse cx="0" cy="-1" rx="3.4" ry="4.2" fill="#10202B" opacity="0.8" />
      ) : (
        <path d="M-7 -2 Q0 4 7 -2" stroke="#10202B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}

      {/* cuerpo con banda reflectante */}
      <path d="M-19 12 Q-22 44 -14 48 L14 48 Q22 44 19 12 Q0 4 -19 12 Z" fill={color} stroke={dark} strokeWidth="2.5" />
      <rect x="-17" y="24" width="34" height="8" rx="3" fill="#EAF1F7" opacity="0.85" />

      {/* brazo izquierdo (en reposo) */}
      <path d="M-19 16 Q-30 26 -27 38" stroke={dark} strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="-27" cy="39" r="4.5" fill={color} stroke={dark} strokeWidth="2" />

      {/* brazo derecho (trabaja) */}
      <g transform="translate(19 16)">
        <g className={working ? "arm-work" : undefined}>
          <path d="M0 0 Q11 8 9 22" stroke={dark} strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="9" cy="23" r="4.5" fill={color} stroke={dark} strokeWidth="2" />
        </g>
      </g>

      {/* piernas */}
      <rect x="-12" y="48" width="8" height="10" rx="4" fill={dark} />
      <rect x="4" y="48" width="8" height="10" rx="4" fill={dark} />

      {/* accesorio por estación */}
      {accessory === "headset" && (
        <g>
          <path d="M-29 -26 Q0 -52 29 -26" stroke={dark} strokeWidth="3" fill="none" />
          <circle cx="-29" cy="-22" r="4" fill={dark} />
          <circle cx="29" cy="-22" r="4" fill={dark} />
          <path d="M-29 -20 Q-24 -4 -12 -2" stroke={dark} strokeWidth="2.5" fill="none" />
          <circle cx="-11" cy="-2" r="2.4" fill={dark} />
        </g>
      )}
      {accessory === "glasses" && (
        <g stroke="#EAF1F7" strokeWidth="2" fill="none">
          <rect x="-17" y="-23" width="14" height="12" rx="4" />
          <rect x="3" y="-23" width="14" height="12" rx="4" />
          <line x1="-3" y1="-17" x2="3" y2="-17" />
        </g>
      )}
      {accessory === "badge" && (
        <g>
          <path d="M-8 12 L-2 30 M8 12 L2 30" stroke={dark} strokeWidth="2" />
          <rect x="-8" y="30" width="16" height="12" rx="2" fill="#EAF1F7" stroke={dark} strokeWidth="1.5" />
          <rect x="-5" y="33" width="10" height="2" fill={color} />
          <rect x="-5" y="37" width="7" height="2" fill="#94A3B8" />
        </g>
      )}
      {accessory === "cap" && (
        <g>
          <path d="M-27 -28 A27 21 0 0 1 27 -28 L27 -24 Q0 -38 -27 -24 Z" fill={dark} />
          <path d="M16 -33 Q36 -31 40 -23 L26 -26 Z" fill={dark} />
          <circle cx="0" cy="-42" r="2.6" fill={color} />
        </g>
      )}
    </g>
  );
}
