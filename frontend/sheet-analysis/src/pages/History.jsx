import React, { useEffect, useState, useRef, useContext } from "react";
import { Chart, registerables } from "chart.js";
import { ThemeContext } from "../context/ThemeContext";
import { saveAs } from "file-saver";
import Navbar from "../components/Navbar";
import API from "../api"; // ✅ centralized axios instance
import "../styles/History.css";

Chart.register(...registerables);

function HistoryPage() {
  const { darkMode } = useContext(ThemeContext);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("uploadDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // ✅ Fetch history using API wrapper
  useEffect(() => {
    API.get("/files/historyWithChartData")
      .then((res) => setHistory(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error fetching history:", err));
  }, []);

  const filteredHistory = history.filter((file) =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ File download
  const handleDownload = async (file) => {
    try {
      const response = await API.get(`/files/download/${file.fileId}`, {
        responseType: "blob",
      });
      saveAs(response.data, file.originalName);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // ✅ Sorting
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortKey === "uploadDate") {
      return sortOrder === "asc"
        ? new Date(a.uploadDate) - new Date(b.uploadDate)
        : new Date(b.uploadDate) - new Date(a.uploadDate);
    } else {
      return sortOrder === "asc"
        ? (a[sortKey] || "").localeCompare(b[sortKey] || "")
        : (b[sortKey] || "").localeCompare(a[sortKey] || "");
    }
  });

  const handleSort = (key) => {
    setSortKey(key);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // ✅ View chart
  const viewChart = (file) => {
    setSelectedFile(file);
    setShowModal(true);

    setTimeout(() => {
      if (!chartRef.current) return;
      const ctx = chartRef.current.getContext("2d");

      if (chartInstanceRef.current) chartInstanceRef.current.destroy();

      const numericData = file.data.map((v) => Number(v) || 0);

      chartInstanceRef.current = new Chart(ctx, {
        type: file.chartType || "bar",
        data: {
          labels: file.labels,
          datasets: [
            {
              label: `${file.selectedY} vs ${file.selectedX}`,
              data: numericData,
              backgroundColor: darkMode ? "#81C784" : "#4CAF50",
              borderColor: darkMode ? "#A5D6A7" : "#388E3C",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { labels: { color: darkMode ? "#fff" : "#000" } },
          },
          scales: {
            x: {
              ticks: { color: darkMode ? "#fff" : "#000" },
              grid: { color: darkMode ? "#444" : "#ddd" },
            },
            y: {
              ticks: { color: darkMode ? "#fff" : "#000" },
              grid: { color: darkMode ? "#444" : "#ddd" },
            },
          },
        },
      });
    }, 50);
  };

  // ✅ Delete single file
  const handleDeleteFile = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await API.delete(`/files/${id}`);
      setHistory(history.filter((file) => file._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ✅ Clear all history
  const handleClearAll = async () => {
    if (!window.confirm("This will clear ALL history. Proceed?")) return;
    try {
      await API.delete("/files");
      setHistory([]);
    } catch (err) {
      console.error("Clear history failed:", err);
    }
  };

  const closeChart = () => {
    setShowModal(false);
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
  };

  const downloadChart = () => {
    if (!chartRef.current || !selectedFile) return;
    const canvas = chartRef.current;
    canvas.toBlob((blob) => {
      saveAs(blob, `${selectedFile.fileName}-chart.png`);
    });
  };

  return (
    <>
      <Navbar />

      <div className="history-container">
        <div className="history-header">
          <h2>Upload History</h2>
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="clear-btn" onClick={handleClearAll}>
            🗑 Clear All
          </button>
        </div>

        <table className="history-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("fileName")}>File</th>
              <th>X Axis</th>
              <th>Y Axis</th>
              <th>Chart Type</th>
              <th>Rows</th>
              <th>Action</th>
              <th onClick={() => handleSort("uploadDate")}>Date</th>
              <th>Download File</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.map((file) => (
              <tr key={file._id}>
                <td>{file.fileName}</td>
                <td>{file.selectedX || "-"}</td>
                <td>{file.selectedY || "-"}</td>
                <td>{file.chartType || "-"}</td>
                <td>{file.rowsCount || "-"}</td>
                <td>
                  <button className="view-btn" onClick={() => viewChart(file)}>
                    View Chart
                  </button>
                </td>
                <td>
                  {file.uploadDate
                    ? new Date(file.uploadDate).toLocaleString()
                    : "-"}
                </td>
                <td>
                  <button
                    className="download-btn"
                    onClick={() => handleDownload(file)}
                  >
                    Download File
                  </button>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteFile(file._id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="chart-modal">
            <span className="close" onClick={closeChart}>
              &times;
            </span>
            <div className="chart-wrapper">
              <h3>{selectedFile.fileName}</h3>
              <canvas ref={chartRef}></canvas>
              <button className="download-btn" onClick={downloadChart}>
                Download Chart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HistoryPage;
