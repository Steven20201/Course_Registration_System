
import { useState } from 'react';
import '../style/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="login-page">

            <div className="loginitem">

                <div className="login-card">

                    <div className="login-icon">
                        🎓
                    </div>

                    <h2>Welcome Back 👋</h2>

                    <p className="login-subtitle">
                        Sign in to your course registration portal
                    </p>

                    <form onSubmit={(e) => e.preventDefault()}>

                        {/* EMAIL */}
                        <div className="input-group">
                            <label>Email</label>

                            <div className="input-wrapper">
                                <span className="input-icon">✉</span>

                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="input-group">
                            <label>Password</label>

                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
