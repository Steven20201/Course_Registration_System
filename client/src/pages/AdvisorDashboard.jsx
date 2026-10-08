import { useAuth } from '../context/AuthContext';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../style/AdvisorDashboard.css';

const AdvisorDashboard = () => {

    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <div className="advisor-layout">

            {/* Sidebar */}
            <aside className="advisor-sidebar">

                <div className="advisor-logo">

                    <span>Course System</span>
                </div>

                <nav className="advisor-nav">

                    <Link
                        to="/advisor/offerings"
                        className={
                            location.pathname === '/advisor/offerings'
                                ? 'advisor-nav-item active'
                                : 'advisor-nav-item'
                        }
                    >
                        📚
                        <span>Course Offerings</span>
                    </Link>


                    <Link
                        to="/advisor/open-section"
                        className={
                            location.pathname === '/advisor/open-section'
                                ? 'advisor-nav-item active'
                                : 'advisor-nav-item'
                        }
                    >
                        ➕
                        <span>Open New Section</span>
                    </Link>


                    <Link
                        to="/advisor/eligibility"
                        className={
                            location.pathname === '/advisor/eligibility'
                                ? 'advisor-nav-item active'
                                : 'advisor-nav-item'
                        }
                    >
                        🎓
                        <span>Student Eligibility</span>
                    </Link>

                </nav>

            </aside>


            {/* Main */}
            <main className="advisor-main">

                <header className="advisor-header">

                    <div>
                        <h1>Advisor Dashboard</h1>
                        <p>
                            Manage course offerings and student registration
                        </p>
                    </div>

                    <div className="header-right">
                        <div className="advisor-profile">
                            <div className="profile-icon">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span>{user?.name}</span>
                        </div>

                        <button
                            className="advisor-logout"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </header>


                <section className="advisor-content">
                    <Outlet />
                </section>

            </main>

        </div>
    );
};

export default AdvisorDashboard;