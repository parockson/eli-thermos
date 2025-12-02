export default function CalculationPanel({ clockState, lastMove }) {
  if (!lastMove) {
    return (
      <div className="card">
        <h2>Calculations</h2>
        <p>No movement yet</p>
      </div>
    );
  }

  const {fromLabel, toLabel, fromPos, toPos, isDiagonal, distance } = lastMove;

  // Determine distance type and formula
  const distanceType = isDiagonal ? "Euclidean" : "Manhattan";
  const distanceFormula = isDiagonal
    ? `√((x₂ - x₁)² + (y₂ - y₁)²) = √((${toPos.x.toFixed(2)} - ${fromPos.x.toFixed(2)})² + (${toPos.y.toFixed(2)} - ${fromPos.y.toFixed(2)})²)`
    : `|y₂ - y₁| = |${toPos.y.toFixed(2)} - ${fromPos.y.toFixed(2)}|`;

  return (
    <div className="card">
      <h3>Calculations</h3>
      <p><strong>Node:</strong> {fromLabel} → {toLabel}</p>
      <p><strong>Coordinates:</strong> ({fromPos.x.toFixed(2)}, {fromPos.y.toFixed(2)}) to ({toPos.x.toFixed(2)}, {toPos.y.toFixed(2)})</p>

      
      <p><strong>Movement:</strong> {isDiagonal ? "Diagonal" : "Vertical"}  <strong>Dist.:</strong> {distanceType}</p>
      
      <p><strong>Calculated Distance:</strong> {distanceFormula} = {distance.toFixed(2)} </p>
      
     
    </div>
  );
}
