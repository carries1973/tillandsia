import type { CSSProperties, ReactNode } from "react";

// Inline stroke/fill SVGs ported from the prototype. Geometry is preserved
// exactly; size / color / stroke-width are props so each call site can match.

interface IP {
  size?: number;
  w?: number;
  h?: number;
  color?: string;
  fill?: string;
  sw?: number;
  style?: CSSProperties;
}

function Svg({
  w,
  h,
  vb = "0 0 24 24",
  fill = "none",
  stroke,
  sw,
  style,
  linecap,
  linejoin,
  children,
}: {
  w: number;
  h: number;
  vb?: string;
  fill?: string;
  stroke?: string;
  sw?: number;
  style?: CSSProperties;
  linecap?: "round";
  linejoin?: "round";
  children: ReactNode;
}) {
  return (
    <svg
      width={w}
      height={h}
      viewBox={vb}
      fill={fill}
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap={linecap}
      strokeLinejoin={linejoin}
      style={style}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function Star({ size = 13, color = "#C9A24A", style }: IP) {
  return (
    <Svg w={size} h={size} fill={color} style={style}>
      <path d="M12 2l2.4 6.9H22l-6 4.4 2.3 7-6.3-4.5L5.7 20l2.3-7-6-4.4h7.6z" />
    </Svg>
  );
}

export function Heart({ size = 16, color = "#6B7085", fill = "none", sw = 1.9, style }: IP) {
  return (
    <Svg w={size} h={size} fill={fill} stroke={fill === "none" ? color : undefined} sw={fill === "none" ? sw : undefined} linejoin="round" style={style}>
      <path d="M12 21s-7-4.5-9.5-9C1 8.5 3 5 6.5 5c2 0 3.5 1.2 4.5 2.8C12 6.2 13.5 5 15.5 5 19 5 21 8.5 19.5 12 17 16.5 12 21 12 21z" />
    </Svg>
  );
}

export function Check({ size = 13, color = "#fff", sw = 2.6, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <path d="M4 12l5 5L20 6" />
    </Svg>
  );
}

export function Caution({ size = 11, color = "#A9974F", sw = 2.4, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <path d="M12 8v5M12 16.5v.5M12 3l9 16H3z" />
    </Svg>
  );
}

export function ShieldCheck({ size = 13, color = "#6E8B6A", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </Svg>
  );
}

export function PinOutline({ size = 12, color = "#B0B3C0", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} style={style}>
      <path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2" />
    </Svg>
  );
}

export function PinFill({ size = 14, color = "#C9B78C", style }: IP) {
  return (
    <Svg w={size} h={size} fill={color} style={style}>
      <path d="M12 2C7.6 2 4 5.6 4 10c0 5.5 8 12 8 12s8-6.5 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
    </Svg>
  );
}

export function Clock({ size = 12, color = "#C9B78C", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </Svg>
  );
}

export function ChevronR({ size = 16, color = "#C9B78C", sw = 2.2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function ChevronL({ w = 8, h = 14, color = "#1E2447", sw = 2.2, style }: IP) {
  return (
    <Svg w={w} h={h} vb="0 0 8 14" stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <path d="M7 1L1 7l6 6" />
    </Svg>
  );
}

export function Navigation({ size = 14, color = "#2A2E48", sw = 1.9, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linejoin="round" style={style}>
      <path d="M3 11l18-8-8 18-2-7-8-3z" />
    </Svg>
  );
}

export function Swap({ size = 14, color = "#C9B78C", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <path d="M4 8h12l-3-3M20 16H8l3 3" />
    </Svg>
  );
}

export function Pulse({ size = 12, color = "#B0B3C0", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <path d="M3 12h4l2 6 4-14 2 8h6" />
    </Svg>
  );
}

export function Transit({ size = 15, color = "#B7BAC7", sw = 1.8, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <path d="M4 17h16M6 17V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8M8 20v1M16 20v1M8 12h8" />
    </Svg>
  );
}

export function UberCar({ size = 10, color = "#C9B78C", sw = 2, cy = 19, r = 1, cxa = 8, cxb = 16, seat = "M5 17h14M6.5 17l1.2-5h8.6l1.2 5M9 12l.8-3h4.4l.8 3", style }: IP & { cy?: number; r?: number; cxa?: number; cxb?: number; seat?: string }) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <path d={seat} />
      <circle cx={cxa} cy={cy} r={r} />
      <circle cx={cxb} cy={cy} r={r} />
    </Svg>
  );
}

export function Search({ size = 17, color = "#9A9EAD", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} style={style}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" strokeLinecap="round" />
    </Svg>
  );
}

export function Plus({ size = 13, color = "#2A2E48", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" style={style}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function X({ size = 16, color = "#C2C7D0", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" style={style}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function Calendar({ size = 17, color = "#9A9EAD", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <path d="M5 7h14v13H5zM8 4v4M16 4v4" />
    </Svg>
  );
}

export function Access({ size = 12, color = "#6E8B6A", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <circle cx="12" cy="4.5" r="1.8" />
      <path d="M9 9h6M12 9v6M12 15l-2 5M12 15l2 5" />
    </Svg>
  );
}

export function Walk({ size = 17, color = "#4A6544", sw = 1.9, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} linecap="round" linejoin="round" style={style}>
      <circle cx="13" cy="4" r="1.6" />
      <path d="M11 8l-2 4 3 2 1 6M13 9l3 2 3-1M9 21l2-5" />
    </Svg>
  );
}

export function SunSmall({ size = 12, color = "#C9A24A", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} style={style}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22" strokeLinecap="round" />
    </Svg>
  );
}

export function WeatherSun({ size = 17, color = "#C9A24A", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} style={style}>
      <circle cx="12" cy="12" r="4.2" />
      <path
        d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function WeatherCloud({ w = 18, h = 16, color = "#8C92A0", sw = 2, style }: IP) {
  return (
    <Svg w={w} h={h} stroke={color} sw={sw} linejoin="round" style={style}>
      <path d="M7 18h10a4 4 0 0 0 .4-8A5.5 5.5 0 0 0 6.5 11 3.6 3.6 0 0 0 7 18z" />
    </Svg>
  );
}

export function WeatherRain({ size = 18, color = "#5F7C99", sw = 2, style }: IP) {
  return (
    <Svg w={size} h={size} stroke={color} sw={sw} style={style}>
      <path d="M7 14h10a4 4 0 0 0 .4-8A5.5 5.5 0 0 0 6.5 7 3.6 3.6 0 0 0 7 14z" strokeLinejoin="round" />
      <path d="M8 17l-1 3M13 17l-1 3M18 17l-1 3" strokeLinecap="round" />
    </Svg>
  );
}

export function SigStar({ size = 11, color = "#C9B78C", style }: IP) {
  return (
    <Svg w={size} h={size} fill={color} style={style}>
      <path d="M12 2l2.4 6.9H22l-6 4.4 2.3 7-6.3-4.5L5.7 20l2.3-7-6-4.4h7.6z" />
    </Svg>
  );
}
