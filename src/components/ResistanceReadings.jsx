export default function ResistanceReadings({ value }) {
  const color = value > 20 ? "red" : "blue";
  return (
    <div className="card resistance-value" style={{ color }}>
      <h2>Resistance</h2>
      <p>{value} Ω</p>
    </div>
  );
}
