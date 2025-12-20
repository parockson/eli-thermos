// ResistanceReadings.jsx
import React, { useEffect, useState } from "react";

export default function ResistanceReadings({ value, color }) {
  const [bgColor, setBgColor] = useState(color);

  useEffect(() => {
    setBgColor(color);
  }, [color]);

  return (
    <div
      className="card resistance-value"
      style={{
        backgroundColor: bgColor,
        transition: "background-color 0.5s ease",
        padding: "10px",
        borderRadius: "8px",
        color: "#000"
      }}
    >
      <h5>Color Code</h5>
      
      {/* Legend */}
      <div style={{ marginTop: "10px", fontSize: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "20px", height: "12px", background: "#F6C28B", display: "inline-block" }} />
          <span>Pale Orange: Dispersal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "20px", height: "12px", background: "#9AD3A6", display: "inline-block" }} />
          <span>Pale Green: Toward Convergence</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "20px", height: "12px", background: "#1F6F43", display: "inline-block" }} />
          <span>Deep Green: At Convergence</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "20px", height: "12px", background: "#0B3D2E", display: "inline-block" }} />
          <span>Navy Green: Default / High Temp</span>
        </div>
      </div>
    </div>
  );
}
