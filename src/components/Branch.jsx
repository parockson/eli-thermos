import React from "react";

export default function BranchLine({ width = 400, height = 100 }) {
  const points = Array.from({ length: 9 }, (_, i) => i + 1); // [1-9]
  const padding = 20;
  const branchLength = width - 2 * padding;
  const step = branchLength / (points.length - 1);

  // Generate a slightly curved path (like a branch)
  const pathD = `
    M ${padding} 50
    C ${padding + branchLength * 0.25} 30,
      ${padding + branchLength * 0.75} 70,
      ${padding + branchLength} 50
  `;

  return (
    <svg width={width} height={height}>
      {/* Draw the branch */}
      <path d={pathD} stroke="#8B4513" strokeWidth={4} fill="none" />

      {/* Draw the points */}
      {points.map((num, index) => {
        // interpolate x along the path
        const x = padding + step * index;
        const y = 50 + 10 * Math.sin((index / (points.length - 1)) * Math.PI); // subtle wave
        return (
          <g key={num}>
            <circle cx={x} cy={y} r={6} fill="#1976d2" />
            <text x={x} y={y + 20} textAnchor="middle" fontSize="14" fill="#333">
              {num}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
