import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CURRENT_TERM = '2026-1';

const OpenNewSection = () => {

    const navigate = useNavigate();

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


    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

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


            <div className="form-card">

                <form>

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