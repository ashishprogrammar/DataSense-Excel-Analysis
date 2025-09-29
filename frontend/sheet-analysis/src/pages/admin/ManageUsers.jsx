import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const blockUser = async (id) => {
    await axios.put(`http://localhost:5000/api/admin/users/${id}/block`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers(users.map(u => u._id === id ? { ...u, blocked: true } : u));
  };

  const unblockUser = async (id) => {
    await axios.put(`http://localhost:5000/api/admin/users/${id}/unblock`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers(users.map(u => u._id === id ? { ...u, blocked: false } : u));
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th><th>Email</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
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
    </div>
  );
};

export default ManageUsers;
