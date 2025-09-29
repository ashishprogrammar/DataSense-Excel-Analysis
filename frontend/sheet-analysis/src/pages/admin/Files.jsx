import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";

const Files = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/files", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(files.filter((file) => file._id !== id));
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  if (loading) return <p>Loading files...</p>;

  return (
    <div className="admin-section">
      <h2>File Management</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>Chart Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file._id}>
                <td>{file.originalName}</td>
                <td>{file.userId?.username || "Unknown"}</td>
                <td>{new Date(file.uploadDate).toLocaleDateString()}</td>
                <td>{file.chartType || "-"}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(file._id)}
                  >
                    Delete
                  </button>
                  <a
                    href={`http://localhost:5000/uploads/${file.fileName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="download-btn"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Files;
