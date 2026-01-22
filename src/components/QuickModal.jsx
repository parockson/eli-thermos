import "../styles/QuickModal.scss";

export default function QuickModal({
  open,
  title,
  message,
  onYes,
  onNo
}) {
  if (!open) return null;

  return (
    <div className="quickmodal-overlay">
      <div className="quickmodal-box">
        <h3>{title}</h3>

        <p className="quickmodal-message">
          {message}
        </p>

        <div className="quickmodal-actions">
          <button className="quickmodal-btn no" onClick={onNo}>
            No
          </button>
          <button className="quickmodal-btn yes" onClick={onYes}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
