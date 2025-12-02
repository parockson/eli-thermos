import React from "react";
import "../styles/OtherButtons.scss";

export default function OtherButtons({ setClockState, setModal }) {
  return (
    <div className="buttons-container">

      <button onClick={() => window.location.reload()}>
        Reset
      </button>

      <button
        onClick={() =>
          setModal({
            open: true,
            title: "Guide",
            content: "Dummy guide description goes here."
          })
        }
      >
        Guide
      </button>

      <button
        onClick={() =>
          setModal({
            open: true,
            title: "Info",
            content: "Placeholder info text for now."
          })
        }
      >
        Info
      </button>

      <button
        onClick={() =>
          setModal({
            open: true,
            title: "Points",
            content: "Temporary testing points description."
          })
        }
      >
        Points
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
    </div>
  );
}
