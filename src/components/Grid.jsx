import React, { useState, useEffect } from "react";

// ===============================
// STATIC GRID DATA & CONFIGURATION
// ===============================

export const nodes = {
  A1: { x: 50, y: 50 }, A2: { x: 50, y: 100 }, A3: { x: 50, y: 150 },
  A4: { x: 50, y: 200 }, A5: { x: 50, y: 250 }, A6: { x: 50, y: 300 },
  A7: { x: 50, y: 350 },

  B1: { x: 100, y: 50 }, B2: { x: 100, y: 100 }, B3: { x: 100, y: 150 },
  B4: { x: 100, y: 200 }, B5: { x: 100, y: 250 }, B6: { x: 100, y: 300 },
  B7: { x: 100, y: 350 },

  C1: { x: 150, y: 50 }, C2: { x: 150, y: 100 }, C3: { x: 150, y: 150 },
  C4: { x: 150, y: 200 }, C5: { x: 150, y: 250 }, C6: { x: 150, y: 300 },
  C7: { x: 150, y: 350 },

  D1: { x: 200, y: 50 }, D2: { x: 200, y: 100 }, D3: { x: 200, y: 150 },
  D4: { x: 200, y: 200 }, D5: { x: 200, y: 250 }, D6: { x: 200, y: 300 },
  D7: { x: 200, y: 350 },

  E1: { x: 250, y: 50 }, E2: { x: 250, y: 100 }, E3: { x: 250, y: 150 },
  E4: { x: 250, y: 200 }, E5: { x: 250, y: 250 }, E6: { x: 250, y: 300 },
  E7: { x: 250, y: 350 }
};

export const alpha = {
  alpha1: { x: 79.29, y: 270.71 },
  alpha2: { x: 79.29, y: 129.29 },
  alpha3: { x: 220.71, y: 129.29 },
  alpha4: { x: 220.71, y: 270.71 }
};

// ===============================
// GRID SHAPES
// ===============================

const center = nodes.C4;
const radius = 100;
const diag1 = [nodes.A2, nodes.E6];
const diag2 = [nodes.E2, nodes.A6];

// ===============================
// NODE COLOR CONFIGURATION
// ===============================

const COLOR_PALE_ORANGE = "#F6C28B"; // Dispersal
const COLOR_DEEP_GREEN = "#1F6F43";  // Convergence
const COLOR_PALE_GREEN = "#9AD3A6";  // Default

const dispersalNodes = [
  "A1","B1","C1","D1","E1",
  "A7","B7","C7","D7","E7"
];

const convergenceNodes = [
  "alpha1","alpha2","alpha3","alpha4",
  "B3","B4","D3","B5","D4","D5",
  "C2","C3","C4","C5","C6"
];

// 🔒 Dispersal nodes are immutable
function enforceDispersal(colors) {
  const next = { ...colors };
  dispersalNodes.forEach(n => {
    next[n] = COLOR_PALE_ORANGE;
  });
  return next;
}

// ===============================
// BIRD PATHS
// ===============================

const birdMovements = {
  A1: ["A1", "A2", "alpha2"],
  C1: ["C1", "C2", "C2"],
  E1: ["E1", "E2", "alpha3"],
  A4: ["A4", "A4", "A4"],
  C4: ["C4", "C4", "C4"],
  E4: ["E4", "E4", "E4"],
  E7: ["E7", "E6", "alpha4"],
  C7: ["C7", "C6", "C6"],
  A7: ["A7", "A6", "alpha1"]
};

// ===============================
// INITIAL STATE
// ===============================

const initialBirdPositions = Object.fromEntries(
  Object.entries(birdMovements).map(([l, p]) => [l, nodes[p[0]] || alpha[p[0]]])
);

const initialLastNodes = Object.fromEntries(
  Object.entries(birdMovements).map(([l, p]) => [l, p[0]])
);

// ===============================
// COMPONENT
// ===============================

export default function Grid({ width = 300, height = 430, onBirdMove, onNodeColorChange }) {
  const [birds, setBirds] = useState(initialBirdPositions);
  const [lastNode, setLastNode] = useState(initialLastNodes);
  const [dragging, setDragging] = useState(null);
  const [flapFrame, setFlapFrame] = useState(0);
  const [selectedBird, setSelectedBird] = useState(null);

  const [nodeColors, setNodeColors] = useState(() => {
    const c = {};
    Object.keys({ ...nodes, ...alpha }).forEach(k => {
      if (convergenceNodes.includes(k)) c[k] = COLOR_DEEP_GREEN;
      else c[k] = COLOR_PALE_GREEN;
    });
    return enforceDispersal(c);
  });

  useEffect(() => {
    if (!dragging) return setFlapFrame(0);
    const i = setInterval(() => setFlapFrame(f => (f + 1) % 2), 150);
    return () => clearInterval(i);
  }, [dragging]);

  // Compute selected bird color dynamically
  const selectedBirdColor = selectedBird ? nodeColors[lastNode[selectedBird]] : null;

  // Notify parent of selected bird's color (optional)
  useEffect(() => {
    if (onNodeColorChange && selectedBird) {
      onNodeColorChange(selectedBirdColor);
    }
  }, [selectedBirdColor, selectedBird, onNodeColorChange]);

  function onMouseDown(label, e) {
    e.preventDefault();
    if (birdMovements[label].length <= 1) return;
    setDragging(label);
    setSelectedBird(label);
    setNodeColors(prev => enforceDispersal(prev));
  }

  function onMouseMove(e) {
    if (!dragging) return;
    const r = e.target.closest("svg").getBoundingClientRect();
    setBirds(p => ({
      ...p,
      [dragging]: { x: e.clientX - r.left, y: e.clientY - r.top }
    }));
  }

  function onMouseUp() {
    if (!dragging) return;

    const bird = dragging;
    const pos = birds[bird];
    const path = birdMovements[bird];
    const points = path.map(k => nodes[k] || alpha[k]);

    let best = points[0], dMin = Infinity;
    points.forEach(p => {
      const d = Math.hypot(p.x - pos.x, p.y - pos.y);
      if (d < dMin) { dMin = d; best = p; }
    });

    const idx = points.indexOf(best);
    const toLabel = path[idx];
    const fromLabel = lastNode[bird];

    setNodeColors(prev => {
      const next = { ...prev };

      if (!dispersalNodes.includes(fromLabel))
        next[fromLabel] = convergenceNodes.includes(fromLabel)
          ? COLOR_DEEP_GREEN
          : COLOR_PALE_GREEN;

      if (!dispersalNodes.includes(toLabel))
        next[toLabel] = convergenceNodes.includes(toLabel)
          ? COLOR_DEEP_GREEN
          : COLOR_PALE_GREEN;

      return enforceDispersal(next);
    });

    if (onBirdMove) {
      const f = nodes[fromLabel] || alpha[fromLabel];
      const t = nodes[toLabel] || alpha[toLabel];
      onBirdMove({
        bird,
        fromLabel,
        toLabel,
        fromPos: f,
        toPos: t,
        isDiagonal: toLabel.startsWith("alpha"),
        distance: Math.hypot(t.x - f.x, t.y - f.y)
      });
    }

    setBirds(p => ({ ...p, [bird]: best }));
    setLastNode(p => ({ ...p, [bird]: toLabel }));
    setDragging(null);
    setSelectedBird(bird); // keep selected bird
  }

  const birdImg = dragging
    ? flapFrame === 0 ? "/birds/bird-flap1.png" : "/birds/bird-flap2.png"
    : "/birds/bird-normal.png";

  return (
    <svg
      width={width}
      height={height}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ background: "#fafafa", border: "1px solid #ccc" }}
    >
      {/* BACKGROUND SHAPES */}
      <polygon
        points={`${nodes.A1.x},${nodes.A1.y} ${nodes.E1.x},${nodes.E1.y} ${nodes.E7.x},${nodes.E7.y} ${nodes.A7.x},${nodes.A7.y}`}
        fill="none"
        stroke="blue"
        strokeWidth="2"
        opacity="0.6"
      />
      <polygon
        points={`${nodes.A2.x},${nodes.A2.y} ${nodes.E2.x},${nodes.E2.y} ${nodes.E6.x},${nodes.E6.y} ${nodes.A6.x},${nodes.A6.y}`}
        fill="none"
        stroke="orange"
        strokeWidth="2"
        opacity="0.6"
      />
      <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="green" strokeWidth="2" opacity="0.6" />
      <line x1={diag1[0].x} y1={diag1[0].y} x2={diag1[1].x} y2={diag1[1].y} stroke="purple" strokeWidth="2" opacity="0.5" />
      <line x1={diag2[0].x} y1={diag2[0].y} x2={diag2[1].x} y2={diag2[1].y} stroke="purple" strokeWidth="2" opacity="0.5" />

      {/* NODES + LABELS */}
      {Object.entries(nodes).map(([l, p]) => (
        <g key={l} style={{ pointerEvents: "none" }}>
          <circle cx={p.x} cy={p.y} r={4} fill={nodeColors[l]} stroke="black" />
          <text x={p.x + 8} y={p.y - 6} fontSize="12" fill="#333">{l}</text>
        </g>
      ))}

      {Object.entries(alpha).map(([l, p]) => (
        <g key={l} style={{ pointerEvents: "none" }}>
          <circle cx={p.x} cy={p.y} r={5} fill={nodeColors[l]} stroke="black" />
          <text x={p.x + 6} y={p.y - 6} fontSize="12" fill="#333">{l}</text>
        </g>
      ))}

      {/* BIRDS */}
      {Object.entries(birds).map(([l, p]) => (
        <image
          key={l}
          href={birdImg}
          x={p.x - 50}
          y={p.y - 50}
          width={100}
          height={100}
          onMouseDown={(e) => onMouseDown(l, e)}
          style={{ cursor: "grab" }}
        />
      ))}
    </svg>
  );
}
