export default function CalculationPanel({ clockState, lastMove }) {
  if (!lastMove) {
    return (
      <div className="card calculation-panel">
        <h2 className="panel-title">AI Concepts</h2>
        <p className="panel-text placeholder">No movement yet</p>
      </div>
    );
  }

  const { fromLabel, toLabel, fromPos, toPos, isDiagonal, distance } = lastMove;

  const distanceType = isDiagonal ? "Euclidean" : "Manhattan";
  const distanceFormula = isDiagonal
    ? `√((x₂-x₁)² + (y₂-y₁)²) = √((${toPos.x} - ${fromPos.x})² + (${toPos.y} - ${fromPos.y})²)`
    : `|y₂-y₁| = |${toPos.y} - ${fromPos.y}|`;

  return (
    <div className="card calculation-panel">
      <h3 className="panel-title">Artificial Intelligence Concepts</h3>

      <div className="panel-row">
        <p className="panel-text"><strong>Node:</strong> {fromLabel} → {toLabel}</p>
        <p className="panel-text"><strong>Coords:</strong> ({fromPos.x}, {fromPos.y}) to ({toPos.x}, {toPos.y})</p>
      </div>

      <div className="panel-row">
        <p className="panel-text"><strong>Movement:</strong> {isDiagonal ? "Diagonal" : "Vertical"}</p>
        <p className="panel-text"><strong>Type:</strong> {distanceType}</p>
      </div>

      <div className="formula-section">
        <p className="panel-text">
          <strong style={{ color: "white" }}>Calculated Distance:</strong>
        </p>

        <code className="formula-text">{distanceFormula}= {distance.toFixed(2)}</code>
      </div>
    </div>
  );
}