import { useEffect, useState } from 'react';

import {
    getAllOfferings,
    updateOffering,
    deleteOffering
} from '../services/api';

const CURRENT_TERM = '2026-1';

const CourseOfferings = () => {
    const [offerings, setOfferings] = useState([]);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchOfferings = async () => {
        try {
            setError('');

            const data = await getAllOfferings(CURRENT_TERM);

            setOfferings(data);
        } catch (err) {
            setError(
                err.respose?.data?.message ||
                'Failed to load course data.'
            );
        }
    };

    useEffect(() => {
        document.title = 'Course Offerings | Advisor';

        fetchOfferings();
    }, []);

    const handleToggleAddDrop = async (offering) => {
        try {
            setError('');
            setSuccessMsg('');

            await updateOffering(
                offering._id,
                {
                    addDropOpen: !offering.addDropOpen
                }
            );

            setSuccessMsg(
                offering.addDropOpen
                    ? 'Add/Drop closed'
                    : 'Add/Drop opened'
            );

            fetchOfferings();

        } catch (err) {
            err.respose?.data?.message ||
                'Failed to update data.'
        }
    }

    const handleDeleteOffering = async (id) => {
        if (!window.confirm("Delete this offering?")) {
            return;
        }

        try {
            setError('');
            setSuccessMsg('');

            await deleteOffering(id);
            setSuccessMsg('Offering deleted successfully');
            fetchOfferings();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to delete offering'
            );
        }
    };

    return (
        <div>
            <div className="page-title">
                <div>
                    <h2>Course Offerings</h2>
                    <p>
                        Current Term: {CURRENT_TERM}
                    </p>
                </div>

                <a
                    href="/advisor/open-section"
                    className='primary-btn'
                >
                    + Open New Section
                </a>
            </div>

            {error && (
                <div className='alert error'>
                    {error}
                </div>
            )}

            {successMsg && (
                <div className='alert success'>
                    {successMsg}
                </div>
            )}

            <div className="table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Section</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Room</th>
                            <th>Instructor</th>
                            <th>Seats</th>
                            <th>Add/Drop</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {offerings.map((offering) => (
                            <tr key={offering._id}>
                                <td>
                                    <strong>
                                        {offering.courseId?.code}
                                    </strong>

                                    <br />

                                    <span className="course-title">
                                        {offering.courseId?.title}
                                    </span>
                                </td>

                                <td>
                                    {offering.section}
                                </td>


                                <td>
                                    {offering.day}
                                </td>


                                <td>
                                    {offering.startTime}
                                    {' - '}
                                    {offering.endTime}
                                </td>


                                <td>
                                    {offering.room}
                                </td>


                                <td>
                                    {offering.instructor}
                                </td>


                                <td>
                                    {offering.seatsTaken}
                                    /
                                    {offering.seats}
                                </td>


                                <td>

                                    <button
                                        className={
                                            offering.addDropOpen
                                                ? 'status-btn open'
                                                : 'status-btn closed'
                                        }
                                        onClick={() =>
                                            handleToggleAddDrop(
                                                offering
                                            )
                                        }
                                    >
                                        {offering.addDropOpen
                                            ? 'Close'
                                            : 'Open'}
                                    </button>

                                </td>


                                <td>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDeleteOffering(
                                                offering._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {offerings.length === 0 && (
                    <div className='empty-state'>
                        No course offerings found.
                    </div>    
                )}
            </div>
        </div>
    )
}

export default CourseOfferings;