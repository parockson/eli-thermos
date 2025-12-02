// Modal.jsx
import React from "react";
import "../styles/Modal.scss";

export default function Modal({ isOpen, onClose, title, content }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{content}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
