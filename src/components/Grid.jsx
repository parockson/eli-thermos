import React, { useState, useEffect } from "react";

// ===============================
// STATIC GRID DATA
// ===============================

const extraLeftColumns = ["W", "X", "Y", "Z"];
const baseColumns = ["A", "B", "C", "D", "E"];
const columns = [...extraLeftColumns, ...baseColumns];
const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const nodes = {};
columns.forEach((col, colIdx) => {
  rows.forEach((row, rowIdx) => {
    nodes[`${col}${row}`] = { x: (colIdx + 1) * 60, y: (rowIdx + 1) * 60 };
  });
});

export const alpha = {
  alpha1: { x: 335, y: 325 },
  alpha2: { x: 335, y: 155 },
  alpha3: { x: 505, y: 155 },
  alpha4: { x: 505, y: 325 }
};

const center = nodes.C4;
const radius = 120;
const diag1 = [nodes.A2, nodes.E6];
const diag2 = [nodes.E2, nodes.A6];

// ===============================
// NODE COLORS (UNCHANGED)
// ===============================

const COLOR_PALE_ORANGE = "#F6C28B";
const COLOR_DEEP_GREEN = "#1F6F43";
const COLOR_PALE_GREEN = "#9AD3A6";

const dispersalNodes = ["A1","B1","C1","D1","E1","A7","B7","C7","D7","E7"];
const convergenceNodes = [
  "alpha1","alpha2","alpha3","alpha4",
  "B3","B4","B5","D3","D4","D5",
  "C2","C3","C4","C5","C6"
];

const isXYZ = (label) => /^[WXYZ]/.test(label);

const getNodeColor = (label) => {
  if (isXYZ(label)) return "black";
  if (dispersalNodes.includes(label)) return COLOR_PALE_ORANGE;
  if (convergenceNodes.includes(label)) return COLOR_DEEP_GREEN;
  return COLOR_PALE_GREEN;
};

// ===============================
// INITIAL BIRDS
// ===============================

const initialBirdLabels = ["W1","W2","W3","W4","W5","W6","W7","W8","W9"];
const initialBirdPositions = Object.fromEntries(
  initialBirdLabels.map(l => [l, nodes[l]])
);

// ===============================
// SEASONAL PATHS (UNCHANGED)
// ===============================

export const seasonalPaths = {
  season1: {
    W1: ["W1","alpha3"],
    W2: ["W2","alpha2"],
    W3: ["W3","C2"],
    W4: ["W4","E4"],
    W5: ["W5","C4"],
    W6: ["W6","A4"],
    W7: ["W7","alpha4"],
    W8: ["W8","C6"],
    W9: ["W9","alpha1"]
  },
  season2: {
    W1: ["W1","E2"],
    W2: ["W2","C2"],
    W3: ["W3","A2"],
    W4: ["W4","E4"],
    W5: ["W5","C4"],
    W6: ["W6","A4"],
    W7: ["W7","E6"],
    W8: ["W8","C6"],
    W9: ["W9","A6"]
  },
  season3: {
    W1: ["W1","E1"],
    W2: ["W2","C1"],
    W3: ["W3","A1"],
    W4: ["W4","E4"],
    W5: ["W5","C4"],
    W6: ["W6","A4"],
    W7: ["W7","E7"],
    W8: ["W8","C7"],
    W9: ["W9","A7"]
  }
};

// ===============================
// GRID COMPONENT
// ===============================

export default function Grid({ activeSeason, onBirdMove }) {
  const [birds, setBirds] = useState(initialBirdPositions);
  const [movingBird, setMovingBird] = useState(null);

  // ===============================
  // Smooth movement (UNCHANGED)
  // ===============================
  const moveSmooth = async (bird, from, to, steps = 50, stepDelay = 20) => {
    const start = nodes[from] || alpha[from];
    const end = nodes[to] || alpha[to];
    setMovingBird(bird);

    for (let i = 1; i <= steps; i++) {
      setBirds(prev => ({
        ...prev,
        [bird]: {
          x: start.x + ((end.x - start.x) * i) / steps,
          y: start.y + ((end.y - start.y) * i) / steps
        }
      }));
      await new Promise(r => setTimeout(r, stepDelay));
    }

    onBirdMove?.({
      bird,
      fromLabel: from,
      toLabel: to,
      fromPos: start,
      toPos: end
    });

    setMovingBird(null);
  };

  // ===============================
  // NEW: Release bird from house
  // ===============================
  const releaseBird = async (houseLabel) => {
    if (!activeSeason || movingBird) return;
    const path = seasonalPaths[activeSeason]?.[houseLabel];
    if (!path) return;

    for (let i = 1; i < path.length; i++) {
      await moveSmooth(houseLabel, path[i - 1], path[i]);
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <svg width={700} height={550}>

      {/* POLYGONS & DIAGONALS */}
      <polygon
        points={`${nodes.A1.x},${nodes.A1.y} ${nodes.E1.x},${nodes.E1.y} ${nodes.E7.x},${nodes.E7.y} ${nodes.A7.x},${nodes.A7.y}`}
        fill="none" stroke="blue" strokeWidth="2" opacity="0.6"
      />
      <polygon
        points={`${nodes.A2.x},${nodes.A2.y} ${nodes.E2.x},${nodes.E2.y} ${nodes.E6.x},${nodes.E6.y} ${nodes.A6.x},${nodes.A6.y}`}
        fill="none" stroke="orange" strokeWidth="2" opacity="0.6"
      />
      <circle
        cx={center.x} cy={center.y} r={radius}
        fill="none" stroke="green" strokeWidth="2" opacity="0.6"
      />
      <line
        x1={diag1[0].x} y1={diag1[0].y}
        x2={diag1[1].x} y2={diag1[1].y}
        stroke="purple" strokeWidth="2" opacity="0.5"
      />
      <line
        x1={diag2[0].x} y1={diag2[0].y}
        x2={diag2[1].x} y2={diag2[1].y}
        stroke="purple" strokeWidth="2" opacity="0.5"
      />

      {/* NODES */}
      {Object.entries(nodes).map(([l, p]) => (
        <g key={l} style={{ pointerEvents: "none" }}>
          <circle cx={p.x} cy={p.y} r={4} fill={getNodeColor(l)} stroke="black" />
          <text x={p.x + 8} y={p.y - 6} fontSize="12">{l}</text>
        </g>
      ))}

      {/* ALPHA NODES */}
      {Object.entries(alpha).map(([l, p]) => (
        <g key={l} style={{ pointerEvents: "none" }}>
          <circle cx={p.x} cy={p.y} r={3} fill={COLOR_DEEP_GREEN} stroke="black" />
          <text x={p.x + 6} y={p.y - 6} fontSize="12">{l}</text>
        </g>
      ))}

      {/* BIRDS */}
      {Object.entries(birds).map(([l, p]) => (
        <image
          key={l}
          href="/birds/bird-normal.png"
          x={p.x - 50}
          y={p.y - 50}
          width={100}
          height={100}
        />
      ))}

      {/* NEW: BIRD HOUSES (ON TOP) */}
      {initialBirdLabels.map(l => {
        const p = nodes[l];
        return (
          <image
            key={`house-${l}`}
            href="/birds/bird-house.png"
            x={p.x - 35}
            y={p.y - 35}
            width={70}
            height={70}
            style={{ cursor: "pointer" }}
            onClick={() => releaseBird(l)}
          />
        );
      })}
    </svg>
  );
}
