import React, { useState, useEffect } from "react";

export default function GraphGrid({
  width = 500,
  height = 630,
  spacingX = 80,
  spacingY = 80,
  offsetX = 80,
  offsetY = 80,
  onBirdMove // callback to send movement info to CalculationPanel
}) {
  const cols = ["A", "B", "C", "D", "E"];
  const rows = [1, 2, 3, 4, 5, 6, 7];

  // ----------------------------
  // Compute Nodes
  // ----------------------------
  const nodes = {};
  cols.forEach((c, i) => {
    rows.forEach((r, j) => {
      nodes[`${c}${r}`] = { x: offsetX + i * spacingX, y: offsetY + j * spacingY };
    });
  });

  // ----------------------------
  // Circle Center & Radius
  // ----------------------------
  const center = nodes["C4"];
  const circlePoints = [nodes["C2"], nodes["C6"], nodes["A4"], nodes["E4"]];
  const radius = Math.max(...circlePoints.map(p => Math.hypot(p.x - center.x, p.y - center.y)));

  // Diagonals
  const diag1 = [nodes["A2"], nodes["E6"]];
  const diag2 = [nodes["E2"], nodes["A6"]];

  // α-points
  function lineCircleIntersection(p1, p2, cx, cy, r) {
    const x1 = p1.x - cx;
    const y1 = p1.y - cy;
    const x2 = p2.x - cx;
    const y2 = p2.y - cy;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dr2 = dx * dx + dy * dy;
    const D = x1 * y2 - x2 * y1;
    const disc = r * r * dr2 - D * D;
    if (disc < 0) return [];
    const sqrtDisc = Math.sqrt(disc);
    const sgn = dy < 0 ? -1 : 1;
    const ix1 = (D * dy + sgn * dx * sqrtDisc) / dr2 + cx;
    const iy1 = (-D * dx + Math.abs(dy) * sqrtDisc) / dr2 + cy;
    const ix2 = (D * dy - sgn * dx * sqrtDisc) / dr2 + cx;
    const iy2 = (-D * dx - Math.abs(dy) * sqrtDisc) / dr2 + cy;
    return [{ x: ix1, y: iy1 }, { x: ix2, y: iy2 }];
  }

  const αd1 = lineCircleIntersection(diag1[0], diag1[1], center.x, center.y, radius);
  const αd2 = lineCircleIntersection(diag2[0], diag2[1], center.x, center.y, radius);

  const alpha = {
    α1: αd2[0],
    α2: αd1[0],
    α3: αd2[1],
    α4: αd1[1]
  };

  // ----------------------------
  // Bird movements & initial positions
  // ----------------------------
  const birdMovements = {
    A1: ["A1", "A2", "α4"],
    C1: ["C1", "C2", "C2"],
    E1: ["E1", "E2", "α3"],
    A4: ["A4", "A4", "A4"],
    C4: ["C4", "C4", "C4"],
    E4: ["E4", "E4", "E4"],
    E7: ["E7", "E6", "α2"],
    C7: ["C7", "C6", "C6"],
    A7: ["A7", "A6", "α1"]
  };

  const initialBirds = Object.fromEntries(
    Object.entries(birdMovements).map(([label, path]) => [label, nodes[path[0]] || alpha[path[0]]])
  );

  const [birds, setBirds] = useState(initialBirds);
  const [dragging, setDragging] = useState(null);
  const [flapFrame, setFlapFrame] = useState(0);

  // ----------------------------
  // Wing flap animation
  // ----------------------------
  useEffect(() => {
    if (!dragging) return;
    const interval = setInterval(() => setFlapFrame(f => (f + 1) % 2), 150);
    return () => clearInterval(interval);
  }, [dragging]);

  // ----------------------------
  // Bird images
  // ----------------------------
  const birdNormal = "/birds/bird-normal.png";
  const birdFlap = flapFrame === 0 ? "/birds/bird-flap1.png" : "/birds/bird-flap2.png";

  function onMouseDown(label) {
    if (birdMovements[label].length <= 1) return;
    setDragging(label);
  }

  function onMouseMove(e) {
    if (!dragging) return;
    const rect = e.target.closest("svg").getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBirds(prev => ({ ...prev, [dragging]: { x, y } }));
  }

  function onMouseUp() {
    if (!dragging) return;
    const label = dragging;
    const pos = birds[label];
    const allowedLabels = birdMovements[label];
    const snapPoints = allowedLabels.map(l => nodes[l] || alpha[l]);

    // Snap to closest allowed point
    let best = snapPoints[0];
    let minDist = Infinity;
    for (let p of snapPoints) {
      const d = Math.hypot(p.x - pos.x, p.y - pos.y);
      if (d < minDist) {
        minDist = d;
        best = p;
      }
    }

    // ----------------------------
    // Track movement logic for CalculationPanel
    // ----------------------------
    const fromPos = birds[label];
    const toPos = best;
    const fromLabel = label;
    const toLabel = allowedLabels[snapPoints.indexOf(best)];
    const isDiagonal = Object.keys(alpha).includes(toLabel);
    const distance = isDiagonal
      ? Math.hypot(toPos.x - fromPos.x, toPos.y - fromPos.y)
      : Math.abs(toPos.y - fromPos.y);

    // Call parent callback (your CalculationPanel should use this)
    if (onBirdMove) {
      onBirdMove({
        bird: label,
        fromLabel,
        toLabel,
        fromPos,
        toPos,
        isDiagonal,
        distance
      });
    }

    setBirds(prev => ({ ...prev, [label]: { x: best.x, y: best.y } }));
    setDragging(null);
  }

  return (
    <svg
      width={width}
      height={height}
      style={{ background: "#fafafa", border: "1px solid #ccc" }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {/* Outer rectangle */}
      <polygon
        points={`${nodes["A1"].x},${nodes["A1"].y} ${nodes["E1"].x},${nodes["E1"].y} ${nodes["E7"].x},${nodes["E7"].y} ${nodes["A7"].x},${nodes["A7"].y}`}
        fill="none"
        stroke="blue"
        strokeWidth="2"
      />

      {/* Inner square */}
      <polygon
        points={`${nodes["A2"].x},${nodes["A2"].y} ${nodes["E2"].x},${nodes["E2"].y} ${nodes["E6"].x},${nodes["E6"].y} ${nodes["A6"].x},${nodes["A6"].y}`}
        fill="none"
        stroke="orange"
        strokeWidth="2"
      />

      {/* Circle */}
      <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="green" strokeWidth="2" />

      {/* Diagonals */}
      <line x1={diag1[0].x} y1={diag1[0].y} x2={diag1[1].x} y2={diag1[1].y} stroke="purple" strokeWidth="2" />
      <line x1={diag2[0].x} y1={diag2[0].y} x2={diag2[1].x} y2={diag2[1].y} stroke="purple" strokeWidth="2" />

      {/* Nodes */}
      {Object.entries(nodes).map(([label, pos]) => (
        <g key={label}>
          <circle cx={pos.x} cy={pos.y} r={5} fill="white" stroke="black" />
          <text x={pos.x + 10} y={pos.y - 8} fontSize="13" fontWeight="bold" fill="#333">{label}</text>
        </g>
      ))}

      {/* α-points */}
      {Object.entries(alpha).map(([label, pos]) => (
        <g key={label}>
          <circle cx={pos.x} cy={pos.y} r={5} fill="red" />
          <text x={pos.x + 8} y={pos.y - 8} fontSize="14" fill="red">{label}</text>
        </g>
      ))}

      {/* Birds */}
      {Object.entries(birds).map(([label, pos]) => (
        <image
          key={label}
          href={dragging === label ? birdFlap : birdNormal}
          x={pos.x - 75}  // default bird size 50px
          y={pos.y - 75}
          width={150}
          height={150}
          style={{ cursor: "grab", userSelect: "none" }}
          onMouseDown={() => onMouseDown(label)}
        />
      ))}
    </svg>
  );
}
