// ===============================
// TemperatureReadings.jsx
// Mercury Bulb Thermometer
// ===============================
import React from "react";

export default function TemperatureReadings({ value }) {
  const minTemp = -10;
  const maxTemp = 50;

  const clampedValue =
    value === null || value === undefined
      ? minTemp
      : Math.min(Math.max(value, minTemp), maxTemp);

  const fillPercent =
    ((clampedValue - minTemp) / (maxTemp - minTemp)) * 100;

  return (
    <div
      className="card temp-value"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0px",
        backgroundColor: "#fff",
        fontSize: "14px",
      }}
    >
      <h5>Ambient Temperature</h5>

      {/* Thermometer */}
      <div
        style={{
          position: "relative",
          width: "4px",
          height: "100px",
          background: "#eee",
          borderRadius: "20px",
          border: "2px solid #555",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden"
        }}
      >
        {/* Mercury column */}
        <div
          style={{
            width: "100%",
            height: `${fillPercent}%`,
            background: "linear-gradient(to top, #c62828, #ff5252)",
            transition: "height 0.6s ease-in-out"
          }}
        />

        {/* Bulb */}
        <div
          style={{
            position: "absolute",
            bottom: "-22px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "60px",
            background: "#c62828",
            borderRadius: "50%",
            border: "3px solid #555"
          }}
        />
      </div>

      {/* Temperature Value */}
      <div
        style={{
          marginTop: "10px",
          fontSize: "10px",
          fontWeight: "bold"
        }}
      >
        {value !== null && value !== undefined ? `${value} °C` : "-- °C"}
      </div>
    </div>
  );
}
