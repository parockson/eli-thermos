import React, { useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts";

export default function Quiz() {
  const [name, setName] = useState("");
  const [data, setData] = useState([{ ambient: "", core: "", pattern: "Circle" }]);
  const [reflections, setReflections] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sessionId] = useState("S" + Date.now().toString().slice(-6));

  const handleEdit = (index, field, value) => {
    setData(prev =>
      prev.map((row, i) =>
        i === index
          ? { ...row, [field]: field === "ambient" || field === "core" ? parseFloat(value) || "" : value }
          : row
      )
    );
  };

  const addRow = () => setData(prev => [...prev, { ambient: "", core: "", pattern: "Circle" }]);
  const deleteRow = index => setData(prev => prev.filter((_, i) => i !== index));

  const handleReflectionChange = (key, value) => {
    setReflections(prev => ({ ...prev, [key]: value }));
  };

  const circle = data.filter(d => d.pattern === "Circle");
  const square = data.filter(d => d.pattern === "Square");
  const rectangle = data.filter(d => d.pattern === "Rectangle");

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
        background: "#fdfdfd",
        padding: "2rem",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Quiz</h1>
      <p style={{ textAlign: "center", color: "gray" }}>
        Session ID: <strong>{sessionId}</strong>
      </p>

      {/* Student Name */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontWeight: "bold" }}>Student Name:</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "4px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          disabled={submitted}
        />
      </div>

      {/* Questions */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
          1. Observe the birds’ movement for each season and complete the IF–THEN rules:
        </label>
        {["Harmattan", "Rainy", "Dry"].map((season, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            IF season = <input type="text" placeholder={season} style={{ width: "150px" }} /> THEN birds converge at{" "}
            <input type="text" placeholder="Pattern" style={{ width: "120px" }} /> shape.
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
          2. Record ambient temperature and core body temperature.
        </label>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "1rem",
          }}
        >
          <thead>
            <tr style={{ background: "#e3f2fd" }}>
              <th>#</th>
              <th>Ambient Temp (°C)</th>
              <th>Core Temp (°C)</th>
              <th>Convergence Pattern</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td style={{ border: "1px solid #ccc", textAlign: "center" }}>{i + 1}</td>
                <td style={{ border: "1px solid #ccc" }}>
                  <input
                    type="number"
                    value={row.ambient}
                    onChange={e => handleEdit(i, "ambient", e.target.value)}
                    style={{ width: "100%", padding: "4px", border: "none", textAlign: "center" }}
                    disabled={submitted}
                  />
                </td>
                <td style={{ border: "1px solid #ccc" }}>
                  <input
                    type="number"
                    value={row.core}
                    onChange={e => handleEdit(i, "core", e.target.value)}
                    style={{ width: "100%", padding: "4px", border: "none", textAlign: "center" }}
                    disabled={submitted}
                  />
                </td>
                <td style={{ border: "1px solid #ccc" }}>
                  <select
                    value={row.pattern}
                    onChange={e => handleEdit(i, "pattern", e.target.value)}
                    style={{ width: "100%", padding: "4px", border: "none" }}
                    disabled={submitted}
                  >
                    <option>Circle</option>
                    <option>Square</option>
                    <option>Rectangle</option>
                  </select>
                </td>
                <td style={{ border: "1px solid #ccc", textAlign: "center" }}>
                  {!submitted && (
                    <button
                      onClick={() => deleteRow(i)}
                      style={{ background: "#e53935", color: "white", border: "none", padding: "4px 8px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!submitted && (
          <button
            onClick={addRow}
            style={{
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          >
            ➕ Add Row
          </button>
        )}
      </div>

      {/* Graph */}
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="ambient" label={{ value: "Ambient Temp (°C)", position: "bottom" }} />
          <YAxis type="number" dataKey="core" label={{ value: "Core Temp (°C)", angle: -90, position: "insideLeft" }} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend verticalAlign="top" align="center" />
          <Scatter name="Circle" data={circle} fill="#1e88e5" />
          <Scatter name="Square" data={square} fill="#e91e63" />
          <Scatter name="Rectangle" data={rectangle} fill="#43a047" />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Remaining Questions */}
      {["q3","q4","q5","q6","q7"].map((q, idx) => (
        <div key={q} style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}>
            {idx + 3}. Question {idx + 3} text here
          </label>
          <textarea
            value={reflections[q]}
            onChange={e => handleReflectionChange(q, e.target.value)}
            style={{ width: "100%", padding: "10px", minHeight: "80px", marginBottom: "8px" }}
            disabled={submitted}
          />
        </div>
      ))}

      {/* Print Button */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={() => window.print()}
          style={{
            backgroundColor: "#d84315",
            color: "white",
            border: "none",
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: "1rem",
            borderRadius: "4px",
          }}
        >
          🖨️ Print Quiz (All Pages)
        </button>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            -webkit-print-color-adjust: exact;
          }
          input, textarea, select {
            font-size: 14px;
            height: auto !important;
            border: 1px solid #ccc !important;
            background: white !important;
          }
          button { display: none; }
          table { page-break-inside: auto; }
          div { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
