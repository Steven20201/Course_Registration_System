import axios from 'axios';

const API_BASE = 'http://localhost:3000/api'; 

const api = axios.create({
    baseURL: API_BASE,
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(
            'API Error:',
            error.config?.url,
            error.response?.status,
            error.response?.data
        );

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }

        return Promise.reject(error);
    }
);

//add auto token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//Authentication
export const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
}

//USers
export const getAllUsers = async (role) => {
    const query = role ? `?role=${role}` : '';
    const res = await api.get(`/users${query}`);
    return res.data;
}

//create a new user
export const createUser = async (userData) => {
    const res = await api.post ('/users', userData);
    return res.data;
}

//updataUser
export const updateUser = async (id, userData) => {
    const res = await api.patch(`/users/${id}`, userData);
    return res.data;
}

//deleteUSers
export const deleteUser = async(id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
}

//For the advisor section, courses
export const getAllCourses = async () => {
    const res = await api.get('/courses');
    return res.data;
}

//Offerings
export const getAllOfferings = async (term) => {
    const query = term ? `?term=${term}` : '';
    const res = await api.get(`/offerings${query}`);
    return res.data;
};

export const createOffering = async (data) => {
    const res = await api.post(`/offerings`, data);
    return res.data;
}

export const updateOffering = async (id, data) => {
    const res = await api.patch(`/offerings/${id}`, data);
    return res.data;
}


export const deleteOffering = async (id) => {
    const res = await api.delete(`/offerings/${id}`);
    return res.data;
}

export const getStudentRecord = async (studentId) => {
    const res = await api.get(`/students/${studentId}/record`);
    return res.data;
};

export const getEligibleCourses = async (studentId, term) => {
    const res = await api.get(`/students/${studentId}/eligible?term=${term}`);
    return res.data;
};

export const createRegistration = async (studentId, offeringId) => {
    const res = await api.post('/registrations', {studentId, offeringId});
    return res.data;
}

export const deleteRegistration = async (id) => {
    const res = await api.delete(`/registrations/${id}`);
    return res.data;
}

export const changePassword = async (newPassword) => {
    const res = await api.patch('/auth/change-password', { newPassword });
    return res.data;
};

//--- Student self-services ---
export const getMyRegistrations = async () => {
    const res = await api.get('/me/registrations');
    return res.data;
};

export const getMyRecord = async () => {
    const res = await api.get('/me/record');
    return res.data;
};



export default api;