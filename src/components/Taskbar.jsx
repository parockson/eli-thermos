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

        {/* <button
          onClick={() =>
            window.open(
              "https://thermoregulation.netlify.app/",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          Quiz
        </button> */}

        g

        <button
          onClick={() =>
            setModal({
              open: true,
              title: "Info",
              content: `Every day, our bodies are quietly responding to the temperature around us. This response is shaped by the relationship between our internal body temperature and the temperature of the external environment. Sometimes, this balance allows us to move through the day comfortably without even noticing the weather. Other times, it pushes us to reach for a jacket, turn on a heater, or switch on the air conditioner to cool down. These everyday choices are not random. They are driven by a powerful scientific process happening inside us. But have you ever stopped to wonder how your body knows when it is too hot or too cold? What mechanisms help keep your internal temperature just right as the environment changes? Even more intriguing, do other living things, such as birds, rely on similar processes to survive shifting temperatures? If they do, what serves as their source of heat or cooling?

ELI is a biomimicry-based interactive learning environment designed to help you explore these questions. Through seven engaging lessons, you will build an understanding of how living organisms regulate their internal body temperature in relation to their environment and how nature’s solutions can inspire scientific thinking. Step inside ELI and uncover the fascinating science of thermoregulation all around you and within you.`
            })
          }
        >
          Info
        </button>

        {/* <button
          onClick={() =>
            setModal({
              open: true,
              title: "Automation",
              content: "Automation feature coming soon."
            })
          }
        >
          Automate
        </button> */}

        {/* Quick Controls Dropdown */}
        {/* <div style={{ position: 'relative', display: 'inline-block' }}>
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
        </div> */}

      </div>
    </div>
  );
}
