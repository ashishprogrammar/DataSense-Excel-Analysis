import React from "react";

const UserInfo = ({ user }) => {
  return (
    <div className="user-info">
      <p><strong>Name:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>
    </div>
  );
};

export default UserInfo;
