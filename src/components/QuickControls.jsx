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
      <div style={{ marginBottom: "9px", fontWeight: 600 }}>
        Quick Controls
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button>Season 1 (Oct–Mar)</button>
        <button>Season 2 (Apr–Jun)</button>
        <button>Season 3 (Jul–Sep)</button>
      </div>
    </div>
  );
}

export default QuickControls;
