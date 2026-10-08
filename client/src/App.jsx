import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import StudentDashboard from "./pages/StudentDashboard";

import OpenNewSection from "./components/OpenNewSection";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>

                    {/* Login */}
                    <Route path="/" element={<Login />} />


                    {/* Admin */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRole="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />


                    {/* Advisor */}
                    <Route
                        path="/advisor"
                        element={
                            <ProtectedRoute allowedRole="advisor">
                                <AdvisorDashboard />
                            </ProtectedRoute>
                        }
                    >
                      
                        <Route
                            path="open-section"
                            element={<OpenNewSection />}
                        />

                    </Route>


                    {/* Student */}
                    <Route
                        path="/student"
                        element={
                            <ProtectedRoute allowedRole="student">
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;