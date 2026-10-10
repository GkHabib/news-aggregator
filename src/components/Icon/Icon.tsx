// Lucide icon geometry used by the design spec. "c:cx,cy,r" is a circle, anything else a path.
const icons = {
  alert: [
    "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
    "M12 9v4",
    "M12 17h.01",
  ],
  arrow: ["M5 12h14", "m12 5 7 7-7 7"],
  back: ["m12 19-7-7 7-7", "M19 12H5"],
  calendar: [
    "M8 2v4",
    "M16 2v4",
    "M3 10h18",
    "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  ],
  check: ["M20 6 9 17l-5-5"],
  info: ["c:12,12,10", "M12 16v-4", "M12 8h.01"],
  more: ["c:12,12,1", "c:19,12,1", "c:5,12,1"],
  plus: ["M5 12h14", "M12 5v14"],
  refresh: [
    "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
    "M21 3v5h-5",
    "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
    "M8 16H3v5",
  ],
  search: ["c:11,11,8", "m21 21-4.3-4.3"],
  sliders: [
    "M21 4h-7",
    "M10 4H3",
    "M21 12h-9",
    "M8 12H3",
    "M21 20h-5",
    "M12 20H3",
    "M14 2v4",
    "M8 10v4",
    "M16 18v4",
  ],
  user: ["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", "c:12,7,4"],
  x: ["M18 6 6 18", "m6 6 12 12"],
} as const;

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

/** Decorative only: the control that contains it carries the accessible name. */
export function Icon({ name, size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ flex: "none" }}
    >
      {icons[name].map((shape) => {
        if (!shape.startsWith("c:")) return <path key={shape} d={shape} />;
        const [cx, cy, r] = shape.slice(2).split(",");
        return <circle key={shape} cx={cx} cy={cy} r={r} />;
      })}
    </svg>
  );
}
