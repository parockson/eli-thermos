import React, { useState, useEffect } from "react";

// ==========================================
// STATIC GRID DATA & CONFIGURATION
// ==========================================

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

const alpha = {
  alpha1: { x: 79.29,  y: 270.71 },
  alpha2: { x: 79.29,  y: 129.29 },
  alpha3: { x: 220.71, y: 129.29 },
  alpha4: { x: 220.71, y: 270.71 }
};

// Grid Geometry
const center = nodes["C4"];
const radius = 100;
const diag1 = [nodes["A2"], nodes["E6"]];
const diag2 = [nodes["E2"], nodes["A6"]];

// Bird paths
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

// Measurement tables
const measurements = {
  atDispersal: {
    A1: { internalTemp: 40.3, resistance: 5238, ambient: 40 },
    C1: { internalTemp: 40.3, resistance: 5238, ambient: 40 },
    E1: { internalTemp: 40.3, resistance: 5238, ambient: 40 },
    A4: { internalTemp: 40.3, resistance: 5238, ambient: 40 },
    C4: { internalTemp: 40.3, resistance: 5238, ambient: 40 },
    E4: { internalTemp: 40.3, resistance: 5238, ambient: 40 },
    A7: { internalTemp: 40.3, resistance: 5238, ambient: 40 },
    C7: { internalTemp: 40.3, resistance: 5238, ambient: 40 },
    E7: { internalTemp: 40.3, resistance: 5238, ambient: 40 }
  },
  towardConvergence: {
    A2: { internalTemp: 40.3, resistance: 5238, ambient: 40.3 },
    C2: { internalTemp: 40.3, resistance: 5238, ambient: 40.3 },
    E2: { internalTemp: 40.3, resistance: 5238, ambient: 40.3 },
    A6: { internalTemp: 40.3, resistance: 5238, ambient: 40.3 },
    C6: { internalTemp: 40.3, resistance: 5238, ambient: 40.3 },
    E6: { internalTemp: 40.3, resistance: 5238, ambient: 40.3 },
    A4: { internalTemp: 40.3, resistance: 5238, ambient: 40.3 },
    C4: { internalTemp: 40.3, resistance: 5238, ambient: 40.3 },
    E4: { internalTemp: 40.3, resistance: 5238, ambient: 40.3 }
  },
  atConvergence: {
    alpha1: { internalTemp: 40.3, resistance: 5238, ambient: 30 },
    alpha2: { internalTemp: 40.3, resistance: 5238, ambient: 30 },
    alpha3: { internalTemp: 40.3, resistance: 5238, ambient: 30 },
    alpha4: { internalTemp: 40.3, resistance: 5238, ambient: 30 },
    A4: { internalTemp: 40.3, resistance: 5238, ambient: 35.3 },
    C4: { internalTemp: 40.3, resistance: 5238, ambient: 35.3 },
    E4: { internalTemp: 40.3, resistance: 5238, ambient: 35.3 },
    C2: { internalTemp: 40.3, resistance: 5238, ambient: 35.3 },
    C6: { internalTemp: 40.3, resistance: 5238, ambient: 35.3 }
  }
};

// Initial bird positions
const initialBirdPositions = Object.fromEntries(
  Object.entries(birdMovements).map(([label, path]) => [
    label,
    nodes[path[0]] || alpha[path[0]]
  ])
);

const initialLastNodes = Object.fromEntries(
  Object.entries(birdMovements).map(([label, path]) => [label, path[0]])
);

// Bird images
const birdNormalStr = "/birds/bird-normal.png";
const birdFlap1Str = "/birds/bird-flap1.png";
const birdFlap2Str = "/birds/bird-flap2.png";

// ==========================================
// COMPONENT
// ==========================================
export default function GraphGrid({ width = 300, height = 430, onBirdMove }) {
  const [birds, setBirds] = useState(initialBirdPositions);
  const [lastNode, setLastNode] = useState(initialLastNodes);
  const [dragging, setDragging] = useState(null);
  const [flapFrame, setFlapFrame] = useState(0);

  useEffect(() => {
    if (!dragging) {
      setFlapFrame(0);
      return;
    }
    const interval = setInterval(() => setFlapFrame((f) => (f + 1) % 2), 150);
    return () => clearInterval(interval);
  }, [dragging]);

  // Determine movement type
  function getMovementType(fromLabel, toLabel, path) {
    const fromIndex = path.indexOf(fromLabel);
    const toIndex = path.indexOf(toLabel);
    if (toIndex > fromIndex) return "towardConvergence";
    if (toIndex < fromIndex) return "atDispersal";
    return "atConvergence";
  }

  function onMouseDown(label, e) {
    e.preventDefault();
    if (birdMovements[label].length <= 1) return;
    setDragging(label);
  }

  function onMouseMove(e) {
    if (!dragging) return;
    const rect = e.target.closest("svg").getBoundingClientRect();
    setBirds((prev) => ({
      ...prev,
      [dragging]: { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }));
  }

  function onMouseUp() {
    if (!dragging) return;

    const birdLabel = dragging;
    const currentPos = birds[birdLabel];
    const allowedLabels = birdMovements[birdLabel];
    const snapPointsCoords = allowedLabels.map((k) => nodes[k] || alpha[k]);

    // Find closest snap point
    let bestPoint = snapPointsCoords[0];
    let shortestDist = Infinity;
    for (let p of snapPointsCoords) {
      const d = Math.hypot(p.x - currentPos.x, p.y - currentPos.y);
      if (d < shortestDist) {
        shortestDist = d;
        bestPoint = p;
      }
    }

    const bestPointIndex = snapPointsCoords.indexOf(bestPoint);
    const toLabel = allowedLabels[bestPointIndex];
    const fromLabel = lastNode[birdLabel];
    const fromPos = nodes[fromLabel] || alpha[fromLabel];
    const toPos = bestPoint;
    const movementDistance = Math.hypot(toPos.x - fromPos.x, toPos.y - fromPos.y);
    const isDiagonal = toLabel.startsWith("alpha");

    const movementType = getMovementType(fromLabel, toLabel, birdMovements[birdLabel]);
    const measurement = measurements[movementType][toLabel];

    if (onBirdMove) {
      onBirdMove({
        bird: birdLabel,
        fromLabel,
        toLabel,
        fromPos,
        toPos,
        isDiagonal,
        distance: movementDistance,
        movementType,
        measurement
      });
    }

    setBirds((prev) => ({ ...prev, [birdLabel]: bestPoint }));
    setLastNode((prev) => ({ ...prev, [birdLabel]: toLabel }));
    setDragging(null);
  }

  const currentBirdImage = dragging ? (flapFrame === 0 ? birdFlap1Str : birdFlap2Str) : birdNormalStr;

  return (
    <svg
      width={width}
      height={height}
      style={{ background: "#fafafa", border: "1px solid #ccc", touchAction: "none" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Background shapes */}
      <polygon
        points={`${nodes.A1.x},${nodes.A1.y} ${nodes.E1.x},${nodes.E1.y} ${nodes.E7.x},${nodes.E7.y} ${nodes.A7.x},${nodes.A7.y}`}
        fill="none" stroke="blue" strokeWidth="2" opacity="0.6"
      />
      <polygon
        points={`${nodes.A2.x},${nodes.A2.y} ${nodes.E2.x},${nodes.E2.y} ${nodes.E6.x},${nodes.E6.y} ${nodes.A6.x},${nodes.A6.y}`}
        fill="none" stroke="orange" strokeWidth="2" opacity="0.6"
      />
      <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="green" strokeWidth="2" opacity="0.6"/>
      <line x1={diag1[0].x} y1={diag1[0].y} x2={diag1[1].x} y2={diag1[1].y} stroke="purple" strokeWidth="2" opacity="0.5"/>
      <line x1={diag2[0].x} y1={diag2[0].y} x2={diag2[1].x} y2={diag2[1].y} stroke="purple" strokeWidth="2" opacity="0.5"/>

      {/* Nodes */}
      {Object.entries(nodes).map(([label, p]) => (
        <g key={label} style={{ pointerEvents: "none" }}>
          <circle cx={p.x} cy={p.y} r={4} fill="white" stroke="black" />
          <text x={p.x + 8} y={p.y - 6} fontSize="12" fill="#333">{label}</text>
        </g>
      ))}

      {Object.entries(alpha).map(([label, p]) => (
        <g key={label} style={{ pointerEvents: "none" }}>
          <circle cx={p.x} cy={p.y} r={5} fill="red" />
          <text x={p.x + 6} y={p.y - 6} fontSize="12" fill="red">{label}</text>
        </g>
      ))}

      {/* Birds */}
      {Object.entries(birds).map(([label, p]) => {
        const isBeingDragged = dragging === label;
        const isMovable = birdMovements[label].length > 1;
        return (
          <image
            key={label}
            href={isBeingDragged ? currentBirdImage : birdNormalStr}
            x={p.x - 50} y={p.y - 50} width={100} height={100} alt={`Bird ${label}`}
            style={{
              cursor: isMovable ? (isBeingDragged ? "grabbing" : "grab") : "default",
              opacity: isMovable ? 1 : 0.8,
              transition: isBeingDragged ? "none" : "all 0.2s ease-out"
            }}
            onMouseDown={(e) => onMouseDown(label, e)}
          />
        );
      })}
    </svg>
  );
}
