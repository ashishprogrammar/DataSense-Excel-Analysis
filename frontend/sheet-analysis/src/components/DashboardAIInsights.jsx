import React, { useState } from "react";
import API from "../api"; // ✅ use central axios
import "../styles/DashboardAIInsights.css";

const DashboardAIInsights = ({ fileId, columnTypes }) => {
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedX, setSelectedX] = useState("");
  const [selectedY, setSelectedY] = useState("");

  const fetchAIInsights = async () => {
    try {
      if (!selectedX || !selectedY) return;

      setLoading(true);

      const res = await API.get(`/files/${fileId}/ai-insights`, {
        params: { selectedX, selectedY },
      });

      setAiInsights(res.data);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-insights-container">
      <h2>AI-Generated Insights</h2>

      <div className="dropdowns">
        <label>
          X-Axis:
          <select value={selectedX} onChange={(e) => setSelectedX(e.target.value)}>
            <option value="">Select X column</option>
            {Object.keys(columnTypes)
              .filter((col) => col !== "0")
              .map((col) => (
                <option key={col} value={col}>
                  {col} ({columnTypes[col]})
                </option>
              ))}
          </select>
        </label>

        <label>
          Y-Axis:
          <select value={selectedY} onChange={(e) => setSelectedY(e.target.value)}>
            <option value="">Select Y column</option>
            {Object.keys(columnTypes)
              .filter((col) => col !== "0")
              .map((col) => (
                <option key={col} value={col}>
                  {col} ({columnTypes[col]})
                </option>
              ))}
          </select>
        </label>

        <button onClick={fetchAIInsights} disabled={!selectedX || !selectedY}>
          Generate Insights
        </button>
      </div>

      {loading && <p className="loading-text">Loading AI insights...</p>}

      {aiInsights ? (
        <div className="insights-box">
          {aiInsights.text && <p>{aiInsights.text}</p>}

          {aiInsights.stats && Object.keys(aiInsights.stats).length > 0 ? (
            <ul>
              {Object.entries(aiInsights.stats).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          ) : (
            <p>No detailed insights available. Please select valid numeric columns.</p>
          )}
        </div>
      ) : (
        !loading && <p>No insights available. Please select columns and generate.</p>
      )}
    </div>
  );
};

export default DashboardAIInsights;
