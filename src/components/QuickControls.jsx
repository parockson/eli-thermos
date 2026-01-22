import "../styles/QuickControls.scss";

function QuickControls({ activeSeason, onSelectSeason }) {
  return (
    <div className="quick-controls">
      <div className="qc-title">Quick Controls</div>

      <div className="qc-buttons">
        <button
          className={activeSeason === "season1" ? "active" : ""}
          onClick={() => onSelectSeason("season1")}
        >
          Season 1 (Oct–Mar)
        </button>

        <button
          className={activeSeason === "season2" ? "active" : ""}
          onClick={() => onSelectSeason("season2")}
        >
          Season 2 (Apr–Jun)
        </button>

        <button
          className={activeSeason === "season3" ? "active" : ""}
          onClick={() => onSelectSeason("season3")}
        >
          Season 3 (Jul–Sep)
        </button>
      </div>
    </div>
  );
}

export default QuickControls;
