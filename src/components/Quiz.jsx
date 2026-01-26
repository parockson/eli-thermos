import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Quiz() {
  const [name, setName] = useState("");

  // Seasons
  const seasons = ["Winter", "Monsoon", "Summer"];

  // Fixed 27 data points (9 birds × 3 seasons)
  const initialData = Array.from({ length: 9 }, (_, birdIdx) =>
    seasons.map(season => ({
      bird: birdIdx + 1,
      season,
      ambient: "",
      core: "",
    }))
  ).flat();

  const [data, setData] = useState(initialData);

  const [reflections, setReflections] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6: "",
    q7: "",
    q8a: "",
    q8b: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sessionId] = useState("S" + Date.now().toString().slice(-6));
  const [maximized, setMaximized] = useState(false);

  // Update ambient/core values
  const handleEdit = (season, bird, field, value) => {
    setData(prev =>
      prev.map(d =>
        d.season === season && d.bird === bird
          ? { ...d, [field]: parseFloat(value) || "" }
          : d
      )
    );
  };

  const handleReflectionChange = (key, value) => {
    setReflections(prev => ({ ...prev, [key]: value }));
  };

  // Filter data per season
  const seasonData = season => data.filter(d => d.season === season);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: maximized ? "100%" : "900px",
        height: maximized ? "100vh" : "auto",
        overflowY: maximized ? "auto" : "visible",
        margin: maximized ? "0" : "0 auto",
        background: "#fdfdfd",
        padding: "2rem",
        position: maximized ? "fixed" : "relative",
        top: 0,
        left: 0,
        zIndex: maximized ? 9999 : "auto",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Quiz</h1>
        <button
          onClick={() => setMaximized(m => !m)}
          style={{
            background: "#2c3e50",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            height: "40px",
          }}
        >
          {maximized ? "🗗 Restore" : "🗖 Maximize"}
        </button>
      </div>

      <p style={{ textAlign: "center", color: "gray" }}>
        Session ID: <strong>{sessionId}</strong>
      </p>

      {/* Student Name */}
      <div style={{ marginBottom: "1rem" }}>
        <label><strong>Student Name:</strong></label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
          disabled={submitted}
        />
      </div>

      {/* Question 1 */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          1. Observe the birds’ movement for each season and complete the IF–THEN rules:
        </label>
        {seasons.map((season, i) => (
          <div key={i}>
            IF season =
            <input style={{ width: "150px" }} placeholder={season} /> THEN birds
            converge at <input style={{ width: "120px" }} placeholder="Pattern" /> shape.
          </div>
        ))}
      </div>

      {/* Tables & Graphs for each season */}
      {seasons.map(season => (

        <div key={season} style={{ marginBottom: "3rem" }}>
          <p> For this {season} season and corresponding convergence pattern, record the ambient temperature and the core body temperature of the birds. </p>
          <h2>{season} Season</h2>

          {/* Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
            <thead>
              <tr style={{ background: "#e3f2fd" }}>
                <th>Bird</th>
                <th>Ambient Temp (°C)</th>
                <th>Core Body Temp (°C)</th>
              </tr>
            </thead>
            <tbody>
              {seasonData(season).map(row => (
                <tr key={row.bird}>
                  <td style={{ border: "1px solid #ccc", textAlign: "center" }}>{row.bird}</td>
                  <td style={{ border: "1px solid #ccc" }}>
                    <input
                      type="number"
                      value={row.ambient}
                      onChange={e =>
                        handleEdit(season, row.bird, "ambient", e.target.value)
                      }
                      style={{ width: "100%", border: "none", textAlign: "center" }}
                      disabled={submitted}
                    />
                  </td>
                  <td style={{ border: "1px solid #ccc" }}>
                    <input
                      type="number"
                      value={row.core}
                      onChange={e =>
                        handleEdit(season, row.bird, "core", e.target.value)
                      }
                      style={{ width: "100%", border: "none", textAlign: "center" }}
                      disabled={submitted}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Graph */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={seasonData(season)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="bird"
                domain={[1, 9]}
                ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                label={{
                  value: "Bird Number",
                  position: "insideBottom",
                  offset: -5,
                }}
              />

              <YAxis label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Line
                type="monotone"
                dataKey="ambient"
                stroke="#1e88e5"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="core"
                stroke="#e53935"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}

      {/* Questions 3–8 */}
      {[
        ["q3", "3. Using the rules you identified and the temperature data you collected, predict how the birds would behave under a new or untested environmental condition (for example, extreme cold or unusually high heat). Explain how this prediction tests or validates the rule-based model used in the simulation."],
        ["q4", "4. Explain how core body temperature is measured in this simulation. Clearly distinguish between ambient temperature and core body temperature."],
        ["q5", "5. Identify and explain three artificial intelligence concepts demonstrated by the birds’ movement in the simulation."],
        ["q6", "6. Some communities interpret bird convergence patterns as environmental indicators (for example, circular convergence indicating rainfall and rectangular convergence indicating heat). Using scientific terminology, explain the constraint satisfaction behavior exhibited by the birds in each season. For each convergence pattern (circle, square, rectangle), describe how ambient temperature and core body temperature influence the birds’ choice of location."],
        ["q7", "7. Birds show different convergence patterns such as circles, squares, and rectangles. Using one convergence pattern as an example, explain how this behavior can be interpreted from a community perspective, a scientific perspective, and an artificial intelligence perspective. Then show how the community observation can be translated into a scientific explanation and formalized as an AI rule."],
      ].map(([key, text]) => (
        <div key={key} style={{ marginBottom: "1rem" }}>
          <label>{text}</label>
          <textarea
            value={reflections[key]}
            onChange={e => handleReflectionChange(key, e.target.value)}
            style={{ width: "100%", minHeight: "120px" }}
            disabled={submitted}
          />
        </div>
      ))}

      {/* Question 8 */}
      <div style={{ marginBottom: "1rem" }}>
        <label>8. Some of the birds are known to be swiftlets that produce edible bird’s nests. Based on this information, answer the following questions:</label>
        <p>(a) During which season are edible bird’s nests graded as having the highest protein composition?</p>
        <textarea
          value={reflections.q8a}
          onChange={e => handleReflectionChange("q8a", e.target.value)}
          style={{ width: "100%" }}
          disabled={submitted}
        />
        <p>(b) Name one health condition that edible bird’s nests are scientifically proven to treat..</p>
        <textarea
          value={reflections.q8b}
          onChange={e => handleReflectionChange("q8b", e.target.value)}
          style={{ width: "100%" }}
          disabled={submitted}
        />
      </div>

      {/* Print */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button onClick={() => window.print()}>🖨️ Print Quiz</button>
      </div>
    </div>
  );
}
