export default function TemperatureReadings({ value }) {
  return (
    <div className="card temp-value">
      <h2>Temperature</h2>
      <p>{value} °C</p>
    </div>
  );
}
