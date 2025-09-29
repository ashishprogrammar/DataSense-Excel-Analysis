import React, { useState } from "react";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import "../styles/FileUpload.css";
import { saveAs } from "file-saver";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend
);

const FileUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [columnTypes, setColumnTypes] = useState(null);
  const [dataPreview, setDataPreview] = useState([]);
  const [dragging, setDragging] = useState(false);

  const [selectedX, setSelectedX] = useState("");
  const [selectedY, setSelectedY] = useState("");
  const [chartType, setChartType] = useState("bar");

  
  const uploadFile = async (fileToUpload) => {
    if (!fileToUpload) return;
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { fileId, columnTypes, dataPreview } = res.data;
      setFileId(fileId);
      setColumnTypes(columnTypes);
      setDataPreview(dataPreview);
      setFile(fileToUpload);
      setSelectedX("");
      setSelectedY("");
      setChartType("bar");
      onUploadSuccess(res.data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file.");
    }
  };

  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  
  const handleUploadClick = () => {
    if (!file) return alert("Please select a file.");
    uploadFile(file);
  };

  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      setFile(droppedFile);
      uploadFile(droppedFile); 
    }
  };

  
  const handleChartOptionsSubmit = async () => {
    if (!selectedX || !selectedY || !chartType || !fileId) {
      alert("Please select all chart options.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/files/${fileId}/chart-options`,
        { selectedX, selectedY, chartType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Chart options saved:", res.data);
      alert("Chart options saved successfully.");
    } catch (error) {
      console.error("Chart option save error:", error);
      alert("Failed to save chart options.");
    }
  };

  
  const chartData = {
    labels: dataPreview.map((row) => row[selectedX]),
    datasets: [
      {
        label: selectedY,
        data: dataPreview.map((row) => row[selectedY]),
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  
  const downloadChart = () => {
    const canvas = document.getElementById("chartCanvas");
    if (canvas) {
      const image = canvas.toDataURL("image/png");
      saveAs(image, "chart.png");
    }
  };

  
  const renderChart = () => {
    if (!selectedX || !selectedY || dataPreview.length === 0) return null;

    const props = {
      id: "chartCanvas",
      data: chartData,
      options: chartOptions,
    };

    switch (chartType) {
      case "bar":
        return <Bar {...props} />;
      case "line":
        return <Line {...props} />;
      case "pie":
        return <Pie {...props} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`file-upload-wrapper ${dragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      
      <div className="file-upload-header">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          id="fileInput"
          className="hidden-input"
        />
        <label htmlFor="fileInput" className="upload-label">
          📁 Choose Excel File
        </label>
        <button onClick={handleUploadClick} className="upload-btn">
          ⬆ Upload File
        </button>
      </div>

      
      {file && (
        <p className="selected-file">
          Selected File: <strong>{file.name}</strong>
        </p>
      )}

      
      {dataPreview.length > 0 && (
        <div className="data-preview">
          <h4>📄 Data Preview</h4>
          <table>
            <thead>
              <tr>
                {Object.keys(dataPreview[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataPreview.map((row, i) => (
                <tr key={i}>
                  {Object.keys(row).map((col) => (
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
      {columnTypes && (
        <div className="chart-options-panel">
          <h3>Select Chart Options</h3>
          <div className="form-group">
            <label>X-Axis:</label>
            <select value={selectedX} onChange={(e) => setSelectedX(e.target.value)}>
              <option value="" disabled>-- Select X Axis --</option>
              {Object.keys(columnTypes)
              .filter((col) => isNaN(col))
              .map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Y-Axis:</label>
            <select value={selectedY} onChange={(e) => setSelectedY(e.target.value)}>
              <option value="" disabled>-- Select Y Axis --</option>
              {Object.keys(columnTypes)
                .filter((col) => isNaN(col))
                .filter((col) => columnTypes[col] === "numeric")
                .map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label>Chart Type:</label>
            <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>
          </div>
          <button className="save-options-btn" onClick={handleChartOptionsSubmit}>
            Save Chart Options
          </button>
        </div>
      )}

      {/* Chart Preview */}
      {selectedX && selectedY && dataPreview.length > 0 && (
        <>
          <div className="chart-preview">{renderChart()}</div>
          <button onClick={downloadChart} className="download-btn">
            ⬇ Download Chart
          </button>
        </>
      )}
    </div>
  );
};

export default FileUpload;

