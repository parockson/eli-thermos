import React from "react";
import "../styles/OtherButtons.scss";

export default function OtherButtons({ setModal, automateRef }) {
  return (
    <div className="buttons-container">
      <button onClick={() => window.location.reload()}>
        Reset
      </button>

      <button
        onClick={() =>
          window.open(
            "https://thermoregulation.netlify.app/",
            "_blank",
            "noopener,noreferrer"
          )
        }
      >
        Quiz
      </button>

      <button
        onClick={() =>
          setModal({
            open: true,
            title: "Node Coordinates",
            content: (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left"
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "2px solid #ccc" }}>
                      <th style={{ padding: "8px" }}>Node</th>
                      <th style={{ padding: "8px" }}>X</th>
                      <th style={{ padding: "8px" }}>Y</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{
                        backgroundColor: "#f0f0f0",
                        fontWeight: "bold"
                      }}
                    >
                      <td colSpan="3" style={{ padding: "8px" }}>
                        Alpha Boundary Points
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px" }}>alpha1</td>
                      <td style={{ padding: "8px" }}>110</td>
                      <td style={{ padding: "8px" }}>380</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px" }}>alpha2</td>
                      <td style={{ padding: "8px" }}>110</td>
                      <td style={{ padding: "8px" }}>180</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px" }}>alpha3</td>
                      <td style={{ padding: "8px" }}>310</td>
                      <td style={{ padding: "8px" }}>180</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px" }}>alpha4</td>
                      <td style={{ padding: "8px" }}>310</td>
                      <td style={{ padding: "8px" }}>380</td>
                    </tr>

                    <tr
                      style={{
                        backgroundColor: "#f0f0f0",
                        fontWeight: "bold"
                      }}
                    >
                      <td colSpan="3" style={{ padding: "8px" }}>
                        Grid Nodes
                      </td>
                    </tr>
                    {["A", "B", "C", "D", "E"].map((col) =>
                      [1, 2, 3, 4, 5, 6, 7].map((row) => (
                        <tr
                          key={`${col}${row}`}
                          style={{ borderBottom: "1px solid #eee" }}
                        >
                          <td style={{ padding: "8px" }}>
                            {col}
                            {row}
                          </td>
                          <td style={{ padding: "8px" }}>
                            {(col.charCodeAt(0) - 64) * 70}
                          </td>
                          <td style={{ padding: "8px" }}>{row * 70}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )
          })
        }
      >
        Points
      </button>

      <button
        onClick={() =>
          setModal({
            open: true,
            title: "Info",
            content: `Every day, our bodies are quietly responding to the temperature around us...`
          })
        }
      >
        Info
      </button>

      {/* Automate Button */}
      <button onClick={() => automateRef.current?.()}>
        Automate
      </button>
    </div>
  );
}
