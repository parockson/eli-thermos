function QuickControls({ setActiveSeason }) {
  return (
    <div className="quick-controls" style={{ background: "#fff", padding: 12, borderRadius: 6 }}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>Quick Controls</div>

      <button onClick={() => setActiveSeason("season1")}>
        Season 1 (Oct–Mar)
      </button>

      <button onClick={() => setActiveSeason("season2")}>
        Season 2 (Apr–Jun)
      </button>

      <button onClick={() => setActiveSeason("season3")}>
        Season 3 (Jul–Sep)
      </button>
    </div>
  );
}

export default QuickControls;
