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
        color: "#000",
        height: "4%"
      }}
    >
      <h5>Color Code</h5>
      
      {/* Legend */}
      
    </div>
  );
}
