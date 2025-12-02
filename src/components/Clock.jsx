import React, { useState } from "react";

export default function StyledInteractiveClock({ size = 300 }) {
  const positions = ["top", "right", "bottom", "left"];
  
  // Reading values (state)
  const readings = {
    top: { T: 30, R: 8037.14 },
    right: { T: 35.3, R: 6424 },
    bottom: { T: 40, R: 5301.47 },
    left: { T: 40.3, R: 5237.85 }
  };

  // Map positions to display labels
  const displayLabels = {
    top: { T: "T1", R: "R1" },
    right: { T: "T2", R: "R2" },
    bottom: { T: "T3", R: "R3" },
    left: { T: "T4", R: "R4" }
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const activePosition = positions[activeIndex];

  const center = size / 2;
  const radius = size / 2 - 40;

  const coords = {
    top: [center, center - radius],
    right: [center + radius, center],
    bottom: [center, center + radius],
    left: [center - radius, center]
  };

  const handleClick = () => {
    setActiveIndex((activeIndex + 1) % positions.length);
  };

  const [hx, hy] = coords[activePosition];

  return (
    <svg
      width={size}
      height={size}
      onClick={handleClick}
      style={{
        cursor: "pointer",
        background: "#fdfdfd",
        borderRadius: "50%",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}
    >
      {/* Outer circle with gradient */}
      <defs>
        <radialGradient id="gradClock" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e0f7fa" />
        </radialGradient>
      </defs>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="url(#gradClock)"
        stroke="#00bcd4"
        strokeWidth="4"
      />

      {/* Handle with circle tip */}
      <line
        x1={center}
        y1={center}
        x2={hx}
        y2={hy}
        stroke="#ff5722"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx={hx} cy={hy} r={8} fill="#ff5722" />

      {/* Clock points */}
      {positions.map(pos => {
        const [x, y] = coords[pos];
        const isActive = pos === activePosition;
        return (
          <g key={pos}>
            {/* Tick */}
            <circle
              cx={x}
              cy={y}
              r={6}
              fill={isActive ? "#ff5722" : "#00bcd4"}
              stroke="#333"
              strokeWidth="1"
            />
            {/* Temperature */}
            <text
              x={x}
              y={y - 12}
              fontSize={isActive ? 18 : 14}
              fontWeight={isActive ? "bold" : "normal"}
              textAnchor="middle"
              fill="#333"
              fontFamily="Arial, sans-serif"
            >
              {`${displayLabels[pos].T}=${readings[pos].T}°`}
            </text>
            {/* Resistance */}
            <text
              x={x}
              y={y + 18}
              fontSize={isActive ? 18 : 14}
              fontWeight={isActive ? "bold" : "normal"}
              textAnchor="middle"
              fill="#333"
              fontFamily="Arial, sans-serif"
            >
              {`${displayLabels[pos].R}=${readings[pos].R}`}
            </text>
          </g>
        );
      })}

      {/* Center circle with subtle shadow */}
      <circle
        cx={center}
        cy={center}
        r={6}
        fill="#00bcd4"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
      />
    </svg>
  );
}
