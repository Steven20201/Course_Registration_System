import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyRegistrations, getMyRecord } from '../services/api';
import '../style/StudentDashboard.css';

const GRADE_POINTS = {
    A: 4.0,
    'B+': 3.5,
    B: 3.0,
    'C+': 2.5,
    C: 2.0,
    'D+': 1.5,
    D: 1.0,
    F: 0.0,
};

const StudentDashboard = () => {
    const { user, logout } = useAuth();

    const [registrations, setRegistrations] = useState([]);
    const [records, setRecords] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Student Dashboard';
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            const [regData, recData] = await Promise.all([
                getMyRegistrations(),
                getMyRecord(),
            ]);

            setRegistrations(regData || []);
            setRecords(recData || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to load dashboard data'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // =========================
    // GPA Calculation
    // =========================
    const calculateGPA = () => {
        const gradedRecords = records.filter(
            (r) => r.grade && r.grade !== 'W'
        );

        if (gradedRecords.length === 0) {
            return {
                gpa: '0.00',
                totalCredits: 0,
            };
        }

        let totalPoints = 0;
        let totalCredits = 0;

        gradedRecords.forEach((r) => {
            const credits = Number(r.courseId?.credits || 0);
            const points = GRADE_POINTS[r.grade] ?? 0;

            totalPoints += points * credits;
            totalCredits += credits;
        });

        const gpa =
            totalCredits > 0
                ? (totalPoints / totalCredits).toFixed(2)
                : '0.00';

        return {
            gpa,
            totalCredits,
        };
    };

    const { gpa, totalCredits } = calculateGPA();

    // =========================
    // Academic Record by Term
    // =========================
    const recordsByTerm = records.reduce((acc, record) => {
        if (!acc[record.term]) {
            acc[record.term] = [];
        }

        acc[record.term].push(record);

        return acc;
    }, {});

    // =========================
    // Add / Drop Status
    // =========================
    const addDropOpen = registrations.some(
        (reg) => reg.offeringId?.addDropOpen
    );

    const advisor =
        registrations.find(
            (reg) => reg.offeringId?.addDropOpen
        )?.offeringId?.instructor || 'your advisor';

    return (
        <div className="student-layout">

            {/* =====================================
                SIDEBAR
            ====================================== */}
            <aside className="student-sidebar">

                <div className="sidebar-logo">
                    <div className="logo-icon">🎓</div>
                    <span>Student Portal</span>
                </div>

                <nav className="sidebar-nav">

                    <button className="nav-item active">

                        Dashboard
                    </button>
                </nav>

            </aside>


            {/* =====================================
                MAIN CONTENT
            ====================================== */}
            <main className="student-main">

                {/* Header */}
                <header className="dashboard-header">

                    <div>
                        <h1>
                            Welcome back, {user?.name || 'Student'}!
                        </h1>

                        <p>
                            Here's your current academic information.
                        </p>
                    </div>

                    <div className="header-actions">

                        <div className="user-profile">
                            <div className="user-avatar">
                                {(user?.name || 'S')
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <span>
                                {user?.name || 'Student'}
                            </span>

                            <span className="dropdown-arrow">
                                ▼
                            </span>
                        </div>

                        <button
                            className="logout-btn"
                            onClick={logout}
                        >
                            ↪ Logout
                        </button>

                    </div>

                </header>


                {/* Error */}
                {error && (
                    <div className="error-alert">
                        {error}
                    </div>
                )}


                {/* Loading */}
                {loading ? (
                    <div className="loading-card">
                        <div className="spinner"></div>
                        <p>Loading your academic information...</p>
                    </div>
                ) : (
                    <>
                        {/* =====================================
                            GPA SUMMARY
                        ====================================== */}
                        <section className="summary-card">

                            <div className="summary-icon">
                                📚
                            </div>

                            <div className="summary-item">
                                <span className="summary-label">
                                    GPA
                                </span>

                                <strong>
                                    {gpa}
                                </strong>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-item">
                                <span className="summary-label">
                                    Total Credits Earned
                                </span>

                                <strong>
                                    {totalCredits}
                                </strong>
                            </div>

                        </section>


                        {/* =====================================
                            CURRENT REGISTRATION
                        ====================================== */}
                        <section className="dashboard-card">

                            <div className="section-title">

                                <div className="section-icon blue">
                                    📅
                                </div>

                                <div>
                                    <h2>
                                        Current Term Registration
                                    </h2>

                                    <p>
                                        {registrations.length === 0
                                            ? 'No current registrations.'
                                            : `${registrations.length} course${registrations.length > 1 ? 's' : ''} registered`}
                                    </p>
                                </div>

                            </div>


                            <div className="table-wrapper">

                                <table className="registration-table">

                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Section</th>
                                            <th>Day</th>
                                            <th>Time</th>
                                            <th>Room</th>
                                            <th>Instructor</th>
                                            <th>Add/Drop Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {registrations.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="empty-table"
                                                >
                                                    <div className="empty-icon">
                                                        📄
                                                    </div>

                                                    <span>
                                                        No courses registered
                                                        for this term.
                                                    </span>
                                                </td>
                                            </tr>
                                        ) : (
                                            registrations.map((reg) => (
                                                <tr key={reg._id}>

                                                    <td>
                                                        <strong>
                                                            {reg.offeringId?.courseId?.code}
                                                        </strong>

                                                        <br />

                                                        <span className="course-title">
                                                            {
                                                                reg.offeringId
                                                                    ?.courseId
                                                                    ?.title
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {reg.offeringId?.section}
                                                    </td>

                                                    <td>
                                                        {reg.offeringId?.day}
                                                    </td>

                                                    <td>
                                                        {reg.offeringId?.startTime}
                                                        -
                                                        {reg.offeringId?.endTime}
                                                    </td>

                                                    <td>
                                                        {reg.offeringId?.room}
                                                    </td>

                                                    <td>
                                                        {reg.offeringId?.instructor}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                reg.offeringId
                                                                    ?.addDropOpen
                                                                    ? 'status-badge open'
                                                                    : 'status-badge closed'
                                                            }
                                                        >
                                                            {reg.offeringId
                                                                ?.addDropOpen
                                                                ? 'Open'
                                                                : 'Closed'}
                                                        </span>

                                                    </td>

                                                </tr>
                                            ))
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </section>

                        <section
                            className={`add-drop-card ${
                                addDropOpen ? 'add-drop-open' : ''
                            }`}
                        >

                            <div className="add-drop-icon">
                                +
                            </div>

                            <div className="add-drop-content">

                                <h2>
                                    Request Add/Drop
                                </h2>

                                {addDropOpen ? (
                                    <>
                                        <p>
                                            The add/drop period is currently{' '}
                                            <strong className="open-text">
                                                OPEN
                                            </strong>{' '}
                                            for at least one of your
                                            registered courses.
                                        </p>

                                        <div className="add-drop-actions">

                                            <a
                                                href="/UG001_Request_for_Add_Drop_Withdrawal.pdf"
                                                download
                                                className="action-link"
                                            >
                                                📄 Download Add/Drop Form
                                            </a>

                                            <a
                                                href={`mailto:advisor@csc220.edu?subject=Add/Drop Request - ${user?.name}&body=Please find my completed add/drop form attached.`}
                                                className="action-link primary"
                                            >
                                                ✉ Email Advisor
                                            </a>

                                        </div>

                                        <p className="advisor-text">
                                            <strong>
                                                Advisor:
                                            </strong>{' '}
                                            {advisor}
                                        </p>
                                    </>
                                ) : (
                                    <p>
                                        The add/drop period is currently{' '}
                                        <strong className="closed-text">
                                            CLOSED
                                        </strong>{' '}
                                        for all your registered courses.
                                    </p>
                                )}

                            </div>

                        </section>

                        <section className="academic-card">

                            <div className="section-title">

                                <div className="section-icon green">
                                    🎓
                                </div>

                                <div>
                                    <h2>
                                        Academic Record
                                    </h2>

                                    <p>
                                        Your completed courses and grades.
                                    </p>
                                </div>

                            </div>


                            {Object.keys(recordsByTerm).length === 0 ? (

                                <div className="academic-empty">
                                    <div className="academic-empty-icon">
                                        🎓
                                    </div>

                                    <p>
                                        No completed courses yet.
                                    </p>
                                </div>

                            ) : (

                                Object.entries(recordsByTerm).map(
                                    ([term, termRecords]) => (

                                        <div
                                            className="term-section"
                                            key={term}
                                        >

                                            <h3>
                                                {term}
                                            </h3>

                                            <div className="table-wrapper">

                                                <table className="academic-table">

                                                    <thead>
                                                        <tr>
                                                            <th>Course</th>
                                                            <th>Credits</th>
                                                            <th>Grade</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>

                                                        {termRecords.map((r) => (

                                                            <tr key={r._id}>

                                                                <td>
                                                                    <strong>
                                                                        {
                                                                            r.courseId
                                                                                ?.code
                                                                        }
                                                                    </strong>

                                                                    {' - '}

                                                                    {
                                                                        r.courseId
                                                                            ?.title
                                                                    }
                                                                </td>

                                                                <td>
                                                                    {
                                                                        r.courseId
                                                                            ?.credits
                                                                    }
                                                                </td>

                                                                <td>

                                                                    <span
                                                                        className={`grade grade-${r.grade?.replace(
                                                                            '+',
                                                                            'plus'
                                                                        )}`}
                                                                    >
                                                                        {r.grade}
                                                                    </span>

                                                                </td>

                                                                <td
                                                                    className={
                                                                        r.grade ===
                                                                        'F'
                                                                            ? 'retake'
                                                                            : 'completed'
                                                                    }
                                                                >
                                                                    {r.grade ===
                                                                    'F'
                                                                        ? 'Retake required'
                                                                        : 'Completed'}
                                                                </td>

                                                            </tr>

                                                        ))}

                                                    </tbody>

                                                </table>

                                            </div>

                                        </div>

                                    )
                                )

                            )}

                        </section>

                    </>
                )}

            </main>
        </div>
    );
};

export default StudentDashboard;