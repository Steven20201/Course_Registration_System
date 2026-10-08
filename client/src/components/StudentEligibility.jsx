import { useEffect, useState } from 'react';

import {
    getAllUsers,
    getEligibleCourses,
    createRegistration
} from '../services/api';

const CURRENT_TERM = '2026-1';

const StudentEligibility = () => {

    const [students, setStudents] = useState([]);

    const [selectedStudentId, setSelectedStudentId] =
        useState('');

    const [eligibleResult, setEligibleResult] =
        useState(null);

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');


    useEffect(() => {

        document.title = 'Student Eligibility | Advisor';

        const fetchStudents = async () => {

            try {

                const data = await getAllUsers('student');

                setStudents(data);

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    'Failed to load students'
                );
            }
        };

        fetchStudents();

    }, []);


    const handleCheckEligible = async () => {

        if (!selectedStudentId) {
            return;
        }

        try {

            setError('');
            setSuccessMsg('');
            setEligibleResult(null);

            const result =
                await getEligibleCourses(
                    selectedStudentId,
                    CURRENT_TERM
                );

            setEligibleResult(result);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                'Failed to load eligible courses'
            );
        }
    };


    const handleRegister = async (offeringId) => {

        try {

            setError('');
            setSuccessMsg('');

            await createRegistration(
                selectedStudentId,
                offeringId
            );

            setSuccessMsg(
                'Student registered successfully'
            );

            handleCheckEligible();

        } catch (err) {

            setError(
                err.response?.data?.message ||
                'Failed to register student'
            );
        }
    };


    return (
        <div>

            <div className="page-title">

                <div>

                    <h2>
                        Check Student Eligibility
                    </h2>

                    <p>
                        Check eligible courses and register students
                    </p>

                </div>

            </div>


            {error && (
                <div className="alert error">
                    {error}
                </div>
            )}


            {successMsg && (
                <div className="alert success">
                    {successMsg}
                </div>
            )}


            {/* Student Selection */}

            <div className="eligibility-card">

                <label>
                    Select Student
                </label>

                <div className="eligibility-controls">

                    <select
                        value={selectedStudentId}
                        onChange={(e) => {

                            setSelectedStudentId(
                                e.target.value
                            );

                            setEligibleResult(null);

                        }}
                    >

                        <option value="">
                            -- Select Student --
                        </option>

                        {students.map((student) => (

                            <option
                                key={student._id}
                                value={student._id}
                            >
                                {student.name}
                                {' '}
                                ({student.studentId})
                            </option>

                        ))}

                    </select>


                    <button
                        className="primary-btn"
                        onClick={handleCheckEligible}
                        disabled={!selectedStudentId}
                    >
                        Check Eligible Courses
                    </button>

                </div>

            </div>


            {/* Results */}

            {eligibleResult && (

                <div className="results-card">

                    <h3>
                        Eligible Courses
                    </h3>


                    {eligibleResult.eligible.length === 0 ? (

                        <p className="empty-state">
                            No eligible courses found.
                        </p>

                    ) : (

                        <div className="table-card">

                            <table className="data-table">

                                <thead>

                                    <tr>
                                        <th>Course</th>
                                        <th>Section</th>
                                        <th>Seats Left</th>
                                        <th>Retake</th>
                                        <th>Action</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {eligibleResult.eligible.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.offering._id
                                                }
                                            >

                                                <td>

                                                    <strong>
                                                        {
                                                            item.course
                                                                .code
                                                        }
                                                    </strong>

                                                    <br />

                                                    <span className="course-title">
                                                        {
                                                            item.course
                                                                .title
                                                        }
                                                    </span>

                                                </td>


                                                <td>
                                                    {
                                                        item.offering
                                                            .section
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        item.seatsRemaining
                                                    }
                                                </td>


                                                <td>

                                                    {item.retakeRequired
                                                        ? 'Yes (F)'
                                                        : 'No'}

                                                </td>


                                                <td>

                                                    <button
                                                        className="primary-btn small"
                                                        onClick={() =>
                                                            handleRegister(
                                                                item.offering
                                                                    ._id
                                                            )
                                                        }
                                                    >
                                                        Register
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}


                    {/* Excluded */}

                    <h3 className="excluded-title">
                        Excluded Courses
                    </h3>


                    {eligibleResult.excluded.length === 0 ? (

                        <p>
                            None.
                        </p>

                    ) : (

                        <div className="excluded-list">

                            {eligibleResult.excluded.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="excluded-item"
                                    >

                                        <strong>
                                            {item.course.code}
                                            {' - '}
                                            {item.course.title}
                                        </strong>

                                        <span>
                                            {item.reason}
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            )}

        </div>
    );
};

export default StudentEligibility;