import React, { useEffect, useState } from "react";
import API from "../../api"; // ✅ centralized axios instance
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

const Overview = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats"); // ✅ no need to manually add token
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">Total Users: {stats.totalUsers || 0}</div>
        <div className="stat-card">Active Users: {stats.activeUsers || 0}</div>
        <div className="stat-card">Total Uploads: {stats.totalUploads || 0}</div>
      </div>

      {/* Chart */}
      <div className="charts-container">
        <div className="chart-card">
          <h3>Chart Types Used</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.chartTypes || []}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {stats.chartTypes?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Overview;
