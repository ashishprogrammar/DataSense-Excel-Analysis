import React, { useEffect, useState } from "react";
import API from "../../api"; // ✅ centralized axios instance

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const blockUser = async (id) => {
    try {
      await API.put(`/admin/users/${id}/block`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, blocked: true } : u))
      );
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  const unblockUser = async (id) => {
    try {
      await API.put(`/admin/users/${id}/unblock`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, blocked: false } : u))
      );
    } catch (err) {
      console.error("Error unblocking user:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="admin-section">
      <h2>Manage Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.blocked ? "Blocked" : "Active"}</td>
                <td>
                  {u.blocked ? (
                    <button onClick={() => unblockUser(u._id)}>Unblock</button>
                  ) : (
                    <button onClick={() => blockUser(u._id)}>Block</button>
                  )}
                  <button onClick={() => deleteUser(u._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
