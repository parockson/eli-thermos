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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        borderRadius: "8px",
        color: "#000",
        transition: "background-color 0.5s ease",
        backgroundColor: "#fff"
      }}
    >
      <p style={{ fontSize: "15px", fontWeight: "bold" }}>Thermistor Color</p>
     

      {/* Color box representing the node the bird landed on */}
      <div
        style={{
          width: "70px",
          height: "10px",
          backgroundColor: bgColor || "#000",
          border: "2px solid #555",
          borderRadius: "12%",
          margin: "1px 0"
        }}
      />

      
    </div>
  );
}
