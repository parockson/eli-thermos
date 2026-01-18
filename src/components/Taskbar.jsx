import React, { useState, useRef } from "react";
import "../styles/Taskbar.scss";
import QuickControls from "./QuickControls";

export default function Taskbar({ setModal, automateRef }) {
  const [showQuickDropdown, setShowQuickDropdown] = useState(false);
  const dropdownRef = useRef(null);

  return (
    <div className="taskbar">

      {/* TITLE */}
      <h1 className="taskbar-title">ELI-Thermoregulation</h1>

      {/* ADDED BUTTONS (FROM OtherButtons) */}
      <div className="taskbar-buttons">

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
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ccc' }}>
                        <th style={{ padding: '8px' }}>Node</th>
                        <th style={{ padding: '8px' }}>X</th>
                        <th style={{ padding: '8px' }}>Y</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Alpha Points */}
                      <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}><td colSpan="3" style={{ padding: '8px' }}>Alpha Boundary Points</td></tr>
                      <tr><td style={{ padding: '8px' }}>alpha1</td><td style={{ padding: '8px' }}>110</td><td style={{ padding: '8px' }}>380</td></tr>
                      <tr><td style={{ padding: '8px' }}>alpha2</td><td style={{ padding: '8px' }}>110</td><td style={{ padding: '8px' }}>180</td></tr>
                      <tr><td style={{ padding: '8px' }}>alpha3</td><td style={{ padding: '8px' }}>310</td><td style={{ padding: '8px' }}>180</td></tr>
                      <tr><td style={{ padding: '8px' }}>alpha4</td><td style={{ padding: '8px' }}>310</td><td style={{ padding: '8px' }}>380</td></tr>

                      {/* Grid Nodes */}
                      <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}><td colSpan="3" style={{ padding: '8px' }}>Grid Nodes</td></tr>
                      {['A', 'B', 'C', 'D', 'E'].map(col =>
                        [1, 2, 3, 4, 5, 6, 7].map(row => (
                          <tr key={`${col}${row}`} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px' }}>{col}{row}</td>
                            <td style={{ padding: '8px' }}>{(['A', 'B', 'C', 'D', 'E'].indexOf(col) + 1) * 70}</td>
                            <td style={{ padding: '8px' }}>{row * 70}</td>
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

        <button
          onClick={() =>
            setModal({
              open: true,
              title: "Automation",
              content: "Automation feature coming soon."
            })
          }
        >
          Automate
        </button>

        {/* Quick Controls Dropdown */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button
            onClick={() => setShowQuickDropdown(prev => !prev)}
          >
            Quick Controls
          </button>

          {showQuickDropdown && (
            <div
              ref={dropdownRef}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "8px",
                marginTop: "4px",
                zIndex: 1000,
                minWidth: "180px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
              }}
            >
              <QuickControls automateRef={automateRef} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
