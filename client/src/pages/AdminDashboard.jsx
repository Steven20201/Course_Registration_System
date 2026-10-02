import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, createUser, deleteUser, updateUser } from '../services/api';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('');
    const [error, setError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
    });

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers(roleFilter);
            setUsers(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createUser(formData);
            setFormData({ name: '', email: '', password: '', role: 'student' });
            setShowForm(false);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create users');
        }
    };

    const handleToggleActive = async (user) => {
        try {
            await updateUser(user._id, { active: !user.active });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update users');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(id);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete users');
        }
    };

    return (
        <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Admin Dashboard</h2>
                <button onClick={logout}>Logout</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Role Filter */}
            <div style={{ margin: '10px 0' }}>
                <label>Filter by Role: </label>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="admin">Admin</option>
                    <option value="advisor">Advisor</option>
                    <option value="student">Student</option>
                </select>
            </div>

            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'Create New User'}
            </button>

            {/* Create user form */}
            {showForm && (
                <form onSubmit={handleCreate} style={{ margin: '10px 0', padding: 10, border: '1px solid #ccc' }}>
                    <div>
                        <input
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="admin">Admin</option>
                            <option value="advisor">Advisor</option>
                            <option value="student">Student</option>
                        </select>
                    </div>
                    <button type="submit">Create</button>
                </form>
            )}

            <table border="1" cellPadding="5" style={{ width: '100%', marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.active ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => handleToggleActive(user)}>
                                    {user.active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button onClick={() => handleDelete(user._id)} style={{ marginLeft: 10 }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;