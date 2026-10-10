import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../style/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const user = await login(email, password);

            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'advisor') {
                navigate('/advisor');
            } else {
                navigate('/student');
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 'Login failed'
            );
        }
    };

    return (
        <div className="login-page">    

            
            <div className="loginitem">

                <div className="login-card">

                    <div className="login-icon">
                        🎓
                    </div>

                    <h2>Welcome Back 👋</h2>

                    <p className="login-subtitle">
                        Login to Your Course Registration Portal
                    </p>


                    <form onSubmit={handleSubmit}>

                        {/* EMAIL */}
                        <div className="input-group">

                            <label>Email</label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ✉
                                </span>

                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}
                        <div className="input-group">

                            <label>Password</label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    className="show-password"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>

                            </div>

                        </div>


                        {/* ERROR */}
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}


                        {/* LOGIN BUTTON */}
                        <button
                            type="submit"
                            className="login-button"
                        >
                            Login
                            <span>→</span>
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default Login;