export default function ResistanceReadings({ value }) {
  const color = value > 20 ? "red" : "blue";
  return (
    <div className="card resistance-value" style={{ color }}>
      <h5>Ω color code</h5>
      <p>{value} Ω</p>
    </div>
  );
}
