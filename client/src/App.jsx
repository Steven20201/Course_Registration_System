import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path= "/" element = {<Login />} />
          <Route path = "/admin" element = {
            <ProtectedRoute allowedRole = "admin">
               <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path = "/advisor" element = {
            <ProtectedRoute allowedRole = "advisor">
             <div>Advisor Dashboard (coming soon)</div>
            </ProtectedRoute>
          } />
          <Route path = "/student" element = {
            <ProtectedRoute allowedRole = "student">
               <div>Student Dashboard (coming soon)</div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;