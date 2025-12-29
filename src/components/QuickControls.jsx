function QuickControls({ automateRef }) {
  return (
    <div
      className="quick-controls"
      style={{
        background: "#ffffff",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "12px",
        marginBottom: "12px"
      }}
    >
      <div style={{ marginBottom: "8px", fontWeight: 600 }}>
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
