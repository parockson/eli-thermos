import React, { useState, useEffect } from "react";

export default function GraphGrid({
  width = 500,
  height = 630,
  onBirdMove
}) {
  // -----------------------------------------
  // HARD-CODED GRID COORDINATES
  // -----------------------------------------
  const nodes = {
    A1: { x: 50, y: 50 },  A2: { x: 50, y: 100 }, A3: { x: 50, y: 150 },
    A4: { x: 50, y: 200 }, A5: { x: 50, y: 250 }, A6: { x: 50, y: 300 },
    A7: { x: 50, y: 350 },

    B1: { x: 100, y: 50 },  B2: { x: 100, y: 100 }, B3: { x: 100, y: 150 },
    B4: { x: 100, y: 200 }, B5: { x: 100, y: 250 }, B6: { x: 100, y: 300 },
    B7: { x: 100, y: 350 },

    C1: { x: 150, y: 50 },  C2: { x: 150, y: 100 }, C3: { x: 150, y: 150 },
    C4: { x: 150, y: 200 }, C5: { x: 150, y: 250 }, C6: { x: 150, y: 300 },
    C7: { x: 150, y: 350 },

    D1: { x: 200, y: 50 },  D2: { x: 200, y: 100 }, D3: { x: 200, y: 150 },
    D4: { x: 200, y: 200 }, D5: { x: 200, y: 250 }, D6: { x: 200, y: 300 },
    D7: { x: 200, y: 350 },

    E1: { x: 250, y: 50 },  E2: { x: 250, y: 100 }, E3: { x: 250, y: 150 },
    E4: { x: 250, y: 200 }, E5: { x: 250, y: 250 }, E6: { x: 250, y: 300 },
    E7: { x: 250, y: 350 }
  };

  // -----------------------------------------
  // HARD-CODED α-POINTS
  // -----------------------------------------
  const alpha = {
    alpha1: { x: 79.29,  y: 270.71 },
    alpha2: { x: 79.29,  y: 129.29 },
    alpha3: { x: 220.71, y: 129.29 },
    alpha4: { x: 220.71, y: 270.71 }
  };

  // -----------------------------------------
  // Circle geometry (unchanged)
  // -----------------------------------------
  const center = nodes["C4"];
  const radius = 100;

  const diag1 = [nodes["A2"], nodes["E6"]];
  const diag2 = [nodes["E2"], nodes["A6"]];

  // -----------------------------------------
  // Bird movements (unchanged)
  // -----------------------------------------
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

  // -----------------------------------------
  // Initial bird positions
  // -----------------------------------------
  const initialBirds = Object.fromEntries(
    Object.entries(birdMovements).map(([label, path]) => [
      label,
      nodes[path[0]] || alpha[path[0]]
    ])
  );

  const [birds, setBirds] = useState(initialBirds);

  // NEW: store last snapped node label per bird
  const [lastNode, setLastNode] = useState(
    Object.fromEntries(
      Object.entries(birdMovements).map(([label, path]) => [label, path[0]])
    )
  );

  const [dragging, setDragging] = useState(null);
  const [flapFrame, setFlapFrame] = useState(0);

  // -----------------------------------------
  // Bird animation (unchanged)
  // -----------------------------------------
  useEffect(() => {
    if (!dragging) return;
    const interval = setInterval(() => setFlapFrame((f) => (f + 1) % 2), 150);
    return () => clearInterval(interval);
  }, [dragging]);

  const birdNormal = "/birds/bird-normal.png";
  const birdFlap =
    flapFrame === 0 ? "/birds/bird-flap1.png" : "/birds/bird-flap2.png";

  // -----------------------------------------
  // Drag logic
  // -----------------------------------------
  function onMouseDown(label) {
    if (birdMovements[label].length <= 1) return;
    setDragging(label);
  }

  function onMouseMove(e) {
    if (!dragging) return;
    const rect = e.target.closest("svg").getBoundingClientRect();
    setBirds((prev) => ({
      ...prev,
      [dragging]: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }));
  }

  function onMouseUp() {
    if (!dragging) return;

    const bird = dragging;
    const pos = birds[bird];
    const allowed = birdMovements[bird];

    const snapPoints = allowed.map((k) => nodes[k] || alpha[k]);

    // Snap to closest
    let best = snapPoints[0];
    let dist = Infinity;
    for (let p of snapPoints) {
      const d = Math.hypot(p.x - pos.x, p.y - pos.y);
      if (d < dist) {
        dist = d;
        best = p;
      }
    }

    const toLabel = allowed[snapPoints.indexOf(best)];
    const fromLabel = lastNode[bird];          // NEW: previous node
    const fromPos = nodes[fromLabel] || alpha[fromLabel];
    const toPos = best;

    // NEW: ALWAYS compute true segment distance
    const movementDistance = Math.hypot(
      toPos.x - fromPos.x,
      toPos.y - fromPos.y
    );

    const isDiagonal = toLabel.startsWith("alpha");

    if (onBirdMove) {
      onBirdMove({
        bird,
        fromLabel,
        toLabel,
        fromPos,
        toPos,
        isDiagonal,
        distance: movementDistance   // NEW & CORRECT
      });
    }

    // snap to location
    setBirds((prev) => ({ ...prev, [bird]: best }));

    // update last node
    setLastNode((prev) => ({ ...prev, [bird]: toLabel }));

    setDragging(null);
  }

  // -----------------------------------------
  // Render (unchanged)
  // -----------------------------------------
  return (
    <svg
      width={width}
      height={height}
      style={{ background: "#fafafa", border: "1px solid #ccc" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <polygon
        points={`${nodes.A1.x},${nodes.A1.y} ${nodes.E1.x},${nodes.E1.y} ${nodes.E7.x},${nodes.E7.y} ${nodes.A7.x},${nodes.A7.y}`}
        fill="none"
        stroke="blue"
        strokeWidth="2"
      />

      <polygon
        points={`${nodes.A2.x},${nodes.A2.y} ${nodes.E2.x},${nodes.E2.y} ${nodes.E6.x},${nodes.E6.y} ${nodes.A6.x},${nodes.A6.y}`}
        fill="none"
        stroke="orange"
        strokeWidth="2"
      />

      <circle
        cx={center.x}
        cy={center.y}
        r={radius}
        fill="none"
        stroke="green"
        strokeWidth="2"
      />

      <line
        x1={diag1[0].x}
        y1={diag1[0].y}
        x2={diag1[1].x}
        y2={diag1[1].y}
        stroke="purple"
        strokeWidth="2"
      />
      <line
        x1={diag2[0].x}
        y1={diag2[0].y}
        x2={diag2[1].x}
        y2={diag2[1].y}
        stroke="purple"
        strokeWidth="2"
      />

      {Object.entries(nodes).map(([label, p]) => (
        <g key={label}>
          <circle cx={p.x} cy={p.y} r={4} fill="white" stroke="black" />
          <text x={p.x + 8} y={p.y - 6} fontSize="12" fill="#333">
            {label}
          </text>
        </g>
      ))}

      {Object.entries(alpha).map(([label, p]) => (
        <g key={label}>
          <circle cx={p.x} cy={p.y} r={5} fill="red" />
          <text x={p.x + 6} y={p.y - 6} fontSize="12" fill="red">
            {label}
          </text>
        </g>
      ))}

      {Object.entries(birds).map(([label, p]) => (
        <image
          key={label}
          href={dragging === label ? birdFlap : birdNormal}
          x={p.x - 50}
          y={p.y - 50}
          width={100}
          height={100}
          style={{ cursor: "grab" }}
          onMouseDown={() => onMouseDown(label)}
        />
      ))}
    </svg>
  );
}
