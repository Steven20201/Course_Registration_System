import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChangePassword from "../components/ChangePassword"

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

     if (user.role === 'student' && user.mustChangePassword) {
        return <ChangePassword />;
    }

    return children;
};
export default ProtectedRoute;