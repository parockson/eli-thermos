function QuickControls({ automateRef }) {
  return (
    <div className="quick-controls">
      <div className="quick-controls__title">
        Quick Controls
      </div>

      <div className="quick-controls__buttons">
        <button onClick={() => automateRef.current?.runSeason("season1")}>
          Season 1 (Oct–Mar)
        </button>

        <button onClick={() => automateRef.current?.runSeason("season2")}>
          Season 2 (Apr–Jun)
        </button>

        <button onClick={() => automateRef.current?.runSeason("season3")}>
          Season 3 (Jul–Sep)
        </button>

      </div>
    </div>
  );
}

export default QuickControls;
