import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import Home from "./pages/Home";
import HistoryPage from "./pages/History";
import AdminLayout from "./pages/admin/AdminLayout";
import Overview from "./pages/admin/Overview";
import ManageUsers from "./pages/admin/ManageUsers";
import Files from "./pages/admin/Files";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/history" element={<HistoryPage />} />

          
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route path="overview" element={<Overview />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="files" element={<Files />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
