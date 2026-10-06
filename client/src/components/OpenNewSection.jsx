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

                            <label>
                                Course
                            </label>

                            <select
                                name="courseId"
                                value={formData.courseId}
                                required
                            >
                                <option value="">
                                    -- Select Course --
                                </option>
                            </select>

                        </div>


                        {/* Term */}
                        <div className="form-group">

                            <label>
                                Term
                            </label>

                            <input
                                name="term"
                                value={formData.term}
                                readOnly
                            />

                        </div>


                        {/* Section */}
                        <div className="form-group">

                            <label>
                                Section
                            </label>

                            <input
                                name="section"
                                placeholder="e.g. 1"
                                value={formData.section}
                                required
                            />

                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default OpenNewSection;