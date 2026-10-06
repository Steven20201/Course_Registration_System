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
//comit
};

export default OpenNewSection;