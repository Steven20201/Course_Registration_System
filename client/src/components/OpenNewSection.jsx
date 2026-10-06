import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    getAllCourses,
    createOffering
} from '../services/api';

const CURRENT_TERM = '2026-1';

const OpenNewSection = () => {

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        courseId: '',
        term: CURRENT_TERM,
        section: '',
        day: '',
        startTime: '',
        endTime: '',
        room: '',
        instructor: '',
        seats: ''
    });


    useEffect(() => {

        document.title = 'Open New Section | Advisor';

        const fetchCourses = async () => {

            try {

                const data = await getAllCourses();

                setCourses(data);

            } catch (err) {

                setError(
                    err.response?.data?.message ||
                    'Failed to load courses'
                );

            }

        };

        fetchCourses();

    }, []);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setSuccessMsg('');

        try {

            await createOffering({
                ...formData,
                seats: Number(formData.seats)
            });

            setSuccessMsg(
                'New course section created successfully'
            );

            setFormData({
                courseId: '',
                term: CURRENT_TERM,
                section: '',
                day: '',
                startTime: '',
                endTime: '',
                room: '',
                instructor: '',
                seats: ''
            });

        } catch (err) {

            setError(
                err.response?.data?.message ||
                'Failed to create offering'
            );

        }

    };


    return (
        <div>

            <div className="page-title">

                <div>
                    <h2>Open New Section</h2>

                    <p>
                        Create a new course offering for {CURRENT_TERM}
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


            <div className="form-card">

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">


                        {/* Course */}

                        <div className="form-group">

                            <label>Course</label>

                            <select
                                name="courseId"
                                value={formData.courseId}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    -- Select Course --
                                </option>

                                {courses.map((course) => (

                                    <option
                                        key={course._id}
                                        value={course._id}
                                    >
                                        {course.code} - {course.title}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* Term */}

                        <div className="form-group">

                            <label>Term</label>

                            <input
                                name="term"
                                value={formData.term}
                                readOnly
                            />

                        </div>


                        {/* Section */}

                        <div className="form-group">

                            <label>Section</label>

                            <input
                                name="section"
                                placeholder="e.g. 1"
                                value={formData.section}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Day */}

                        <div className="form-group">

                            <label>Day</label>

                            <select
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    -- Select Day --
                                </option>

                                <option value="Mon">Monday</option>
                                <option value="Tue">Tuesday</option>
                                <option value="Wed">Wednesday</option>
                                <option value="Thu">Thursday</option>
                                <option value="Fri">Friday</option>
                                <option value="Sat">Saturday</option>

                            </select>

                        </div>


                        {/* Start Time */}

                        <div className="form-group">

                            <label>Start Time</label>

                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* End Time */}

                        <div className="form-group">

                            <label>End Time</label>

                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Room */}

                        <div className="form-group">

                            <label>Room</label>

                            <input
                                name="room"
                                placeholder="e.g. B201"
                                value={formData.room}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Instructor */}

                        <div className="form-group">

                            <label>Instructor</label>

                            <input
                                name="instructor"
                                placeholder="Instructor name"
                                value={formData.instructor}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Seats */}

                        <div className="form-group">

                            <label>Maximum Seats</label>

                            <input
                                type="number"
                                min="1"
                                name="seats"
                                placeholder="30"
                                value={formData.seats}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-btn"
                        >
                            Create Section
                        </button>


                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() =>
                                navigate('/advisor/offerings')
                            }
                        >
                            Cancel
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default OpenNewSection;