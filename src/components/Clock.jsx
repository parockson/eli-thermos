import React from "react";

export default function Clock({ clockState, size = 200 }) {
  const { birds, timeIndex } = clockState;

  const center = size / 2;
  const radius = size / 2 - 40;

  const angleStep = (2 * Math.PI) / 9;

  const coords = Array(9)
    .fill()
    .map((_, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      return [
        center + radius * Math.cos(angle),
        center + radius * Math.sin(angle)
      ];
    });

  const [hx, hy] = coords[timeIndex];

  return (
    <svg
      width={size}
      height={size}
      style={{
        background: "#fdfdfd",
        borderRadius: "100%",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="#eef8ff"
        stroke="#00bcd4"
        strokeWidth="4"
      />

      <line
        x1={center}
        y1={center}
        x2={hx}
        y2={hy}
        stroke="#ff5722"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx={hx} cy={hy} r={8} fill="#ff5722" />

      {coords.map(([x, y], i) => {
        const active = i === timeIndex;
        const bird = birds[i];

        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={6}
              fill={active ? "#ff5722" : "#00bcd4"}
              stroke="#333"
              strokeWidth="1"
            />

            <text
              x={x}
              y={y - 12}
              fontSize={active ? 9 : 7}
              fontWeight={active ? "bold" : "normal"}
              textAnchor="middle"
              fill="#333"
            >
              {bird.internalTemperature ?? "--"}
            </text>

            <text
              x={x}
              y={y + 18}
              fontSize={active ? 9 : 7}
              fontWeight={active ? "bold" : "normal"}
              textAnchor="middle"
              fill="#333"
            >
              {bird.internalResistance ?? "--"}
            </text>
          </g>
        );
      })}

      <circle cx={center} cy={center} r={6} fill="#00bcd4" />
    </svg>
  );
}
