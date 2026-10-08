import { useState } from 'react';
import { changePassword } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChangePassword = () => {
    const { user, setUser } = useAuth();   
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await changePassword(newPassword);
            const updatedUser = { ...user, mustChangePassword: false };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div style={{ maxWidth: 300, margin: '100px auto' }}>
            <h2>Change Your Password</h2>
            <p>This is your first login. Please set a new password before continuing.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: 10 }}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: 10 }}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Set Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;