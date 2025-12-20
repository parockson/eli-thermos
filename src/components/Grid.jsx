import React, { useState, useEffect } from "react";

// ===============================
// STATIC GRID DATA & CONFIGURATION
// ===============================

const columns = ['A', 'B', 'C', 'D', 'E'];
const rows = [1, 2, 3, 4, 5, 6, 7];

export const nodes = {};

columns.forEach((col, colIdx) => {
  rows.forEach((row, rowIdx) => {
    nodes[`${col}${row}`] = {
      x: (colIdx + 1) * 70,
      y: (rowIdx + 1) * 70
    };
  });
});

export const alpha = {
  alpha1: { x: 110, y: 380 },
  alpha2: { x: 110, y: 180 },
  alpha3: { x: 310, y: 180 },
  alpha4: { x: 310, y: 380 }
};

// ===============================
// GRID SHAPES
// ===============================

const center = nodes.C4;
const radius = 140;
const diag1 = [nodes.A2, nodes.E6];
const diag2 = [nodes.E2, nodes.A6];

// ===============================
// NODE COLOR CONFIGURATION
// ===============================

const COLOR_PALE_ORANGE = "#F6C28B"; // Dispersal
const COLOR_DEEP_GREEN = "#1F6F43";  // Convergence
const COLOR_PALE_GREEN = "#9AD3A6";  // Default

const dispersalNodes = [
  "A1", "B1", "C1", "D1", "E1",
  "A7", "B7", "C7", "D7", "E7"
];

const convergenceNodes = [
  "alpha1", "alpha2", "alpha3", "alpha4",
  "B3", "B4", "D3", "B5", "D4", "D5",
  "C2", "C3", "C4", "C5", "C6"
];

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

export default function Grid({ width = 430, height = 550, onBirdMove, onNodeColorChange, automateRef }) {
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

  // ===============================
  // FLAPPING EFFECT
  // ===============================
  useEffect(() => {
    if (!dragging) return setFlapFrame(0);
    const i = setInterval(() => setFlapFrame(f => (f + 1) % 2), 150);
    return () => clearInterval(i);
  }, [dragging]);

  const selectedBirdColor = selectedBird ? nodeColors[lastNode[selectedBird]] : null;

  useEffect(() => {
    if (onNodeColorChange && selectedBird) {
      onNodeColorChange(selectedBirdColor);
    }
  }, [selectedBirdColor, selectedBird, onNodeColorChange]);

  // ===============================
  // DRAG FUNCTIONS
  // ===============================
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
    setSelectedBird(bird);
  }

  // ===============================
  // AUTOMATION
  // ===============================
  const automationSequence = [
    { bird: "A1", from: "A1", to: "A2" },
    { bird: "C1", from: "C1", to: "C2" },
    { bird: "E1", from: "E1", to: "E2" },
    { bird: "E7", from: "E7", to: "E6" },
    { bird: "C7", from: "C7", to: "C6" },
    { bird: "A7", from: "A7", to: "A6" },
    { bird: "A1", from: "A2", to: "alpha2" },
    { bird: "E1", from: "E2", to: "alpha3" },
    { bird: "E7", from: "E6", to: "alpha4" },
    { bird: "A7", from: "A6", to: "alpha1" }
  ];

  const runAutomation = async () => {
    for (let i = 0; i < automationSequence.length; i++) {
      const { bird, to } = automationSequence[i];
      const from = lastNode[bird];
      const pos = nodes[to] || alpha[to];

      setBirds(prev => ({ ...prev, [bird]: pos }));
      setLastNode(prev => ({ ...prev, [bird]: to }));

      if (onBirdMove) {
        const f = nodes[from] || alpha[from];
        const t = nodes[to] || alpha[to];
        onBirdMove({
          bird,
          fromLabel: from,
          toLabel: to,
          fromPos: f,
          toPos: t,
          isDiagonal: to.startsWith("alpha"),
          distance: Math.hypot(t.x - f.x, t.y - f.y)
        });
      }

      await new Promise(r => setTimeout(r, 10000));
    }

    // Reverse automation
    for (let i = automationSequence.length - 1; i >= 0; i--) {
      const { bird, from } = automationSequence[i];
      const to = lastNode[bird] === from ? from : lastNode[bird];
      const pos = nodes[from] || alpha[from];

      setBirds(prev => ({ ...prev, [bird]: pos }));
      setLastNode(prev => ({ ...prev, [bird]: from }));

      if (onBirdMove) {
        const f = nodes[to] || alpha[to];
        const t = nodes[from] || alpha[from];
        onBirdMove({
          bird,
          fromLabel: to,
          toLabel: from,
          fromPos: f,
          toPos: t,
          isDiagonal: from.startsWith("alpha"),
          distance: Math.hypot(t.x - f.x, t.y - f.y)
        });
      }

      await new Promise(r => setTimeout(r, 10000));
    }
  };

  // Attach automation to ref
  if (automateRef) automateRef.current = runAutomation;

  // ===============================
  // RENDER
  // ===============================
  return (
    <svg
      width={width}
      height={height}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
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

      {/* NODES */}
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
      {Object.entries(birds).map(([l, p]) => {
        const BIRD_SIZE = 250;
        const HALF_BIRD = BIRD_SIZE / 2;
        const isFlapping = dragging === l;

        const birdImg = isFlapping
          ? flapFrame === 0
            ? "/birds/bird-flap1.png"
            : "/birds/bird-flap2.png"
          : "/birds/bird-normal.png";

        return (
          <image
            key={l}
            href={birdImg}
            x={p.x - HALF_BIRD}
            y={p.y - HALF_BIRD}
            width={BIRD_SIZE}
            height={BIRD_SIZE}
            onMouseDown={(e) => onMouseDown(l, e)}
            style={{ cursor: "grab" }}
          />
        );
      })}
    </svg>
  );
}
