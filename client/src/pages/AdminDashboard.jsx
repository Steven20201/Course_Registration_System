import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, createUser, deleteUser, updateUser } from '../services/api';
import "../style/AdminDashboard.css";

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
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
        document.title = 'Admin Dashboard';
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', role: 'student' });
        setEditingUser(null);
        setShowForm(false);
    };

    const handleCreateClick = () => {
        resetForm();
        setShowForm(true);
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, password: '', role: user.role });
        setShowForm(true);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        try {
            if (editingUser) {

                await updateUser(editingUser._id, {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                });
                setSuccessMsg('User updated successfully');
            } else {
                // Create mode
                await createUser(formData);
                setSuccessMsg(`User created — email: ${formData.email}, password: ${formData.password}`);
            }
            resetForm();
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save user');
        }
    };

    const handleToggleActive = async (user) => {
        try {
            await updateUser(user._id, { active: !user.active });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        setError('');
        setSuccessMsg('');
        try {
            const res = await deleteUser(id);
            setSuccessMsg(res.message || 'User removed');
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        }
    };

    return (
        <div className="admin-layout">

            <aside className='admin-sidebar'>
                <div className='sdiebar-logo'>
                    <span>Course System</span>
                </div>

                <div className="sidebar-menu">
                    <div className="sidebar-item active">
                        👤 &nbsp; Users
                    </div>


                </div>

            </aside>

            <main className='admin-main'>
                <div className="admin-header">
                    <div className='admin-title'>
                        <h2>Admin Dashboard</h2>
                        <p>Manage users, roles and access</p>
                    </div>

                    <div className="header-right">
                        <div className="admin-profile">
                            <div className="profile-icon">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span>{user?.name}</span>
                        </div>

                        <button className="logout-btn" onClick={logout}>
                            ⇥ Logout
                        </button>
                    </div>

                </div>
                {error && (
                    <div className='alert alert-error'>
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className='alert alert-success'>
                        {successMsg}
                    </div>
                )}

                <div className="user-toolbar">
                    <div className="filter-group">
                        <label>Filter by Role: </label>
                        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                            <option value="">All</option>
                            <option value="admin">Admin</option>
                            <option value="advisor">Advisor</option>
                            <option value="student">Student</option>
                        </select>
                    </div>

                </div>

                <button className="create-btn" onClick={() => (showForm ? resetForm() : handleCreateClick())}>
                    {showForm ? 'Cancel' : 'Create New User'}
                </button>

                {showForm && (
                    <form
                        onSubmit={handleSubmitForm}
                        className='user-form'
                    >
                        <h3>{editingUser ? 'Edit User' : 'Create New User'}</h3>
                        <div className='form grid'>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    placeholder="Enter Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                        </div>
                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value
                                    })
                                }
                                required
                            />
                        </div>


                        {!editingUser && (
                            <div className='form-group'>
                                <label>Initial Passowrd</label>
                                <input
                                    type="password"
                                    placeholder="Initial Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                        )}

                        <div className='form-group'>
                            <label>Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="student">Student</option>
                                <option value="advisor">Advisor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button className='save-btn' type="submit">{editingUser ? 'Save Changes' : 'Create'}</button>
                            <button className='cancel-btn' type="button" onClick={resetForm} style={{ marginLeft: 5 }}>
                                Cancel
                            </button>
                        </div>

                    </form>
                )}
                <div className="table-container">
                    <table className='users-table'>
                        <thead>
                            <tr>
                                <th className='role-name'>Name</th>
                                <th className='role-name'>Email</th>
                                <th className='role-name'>Role</th>
                                <th className='role-name'>Active</th>
                                <th className='role-name'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className="role-badge">{user.role}
                                        </span></td>
                                    <td>  <span
                                        className={`status-badge ${user.active
                                                ? 'active'
                                                : 'inactive'
                                            }`}
                                    >
                                        <span className="status-dot"></span>

                                        {user.active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </span></td>
                                    <td>
                                        <div className="actions">

                                            <button
                                                className="btn btn-edit"
                                                onClick={() =>
                                                    handleEditClick(user)
                                                }
                                            >
                                                ✎ Edit
                                            </button>


                                            {user.role !== 'admin' && (
                                                <button
                                                    className="btn btn-toggle"
                                                    onClick={() =>
                                                        handleToggleActive(user)
                                                    }
                                                >
                                                    ◉{' '}
                                                    {user.active
                                                        ? 'Deactivate'
                                                        : 'Activate'}
                                                </button>
                                            )}


                                            {user.role !== 'admin' && (
                                                <button
                                                    className="btn btn-delete"
                                                    onClick={() =>
                                                        handleDelete(user._id)
                                                    }
                                                >
                                                    🗑 Delete
                                                </button>
                                            )}

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </main>











        </div>
    );
};

export default AdminDashboard;