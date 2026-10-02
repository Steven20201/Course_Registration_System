import axios from 'axios';

const API_BASE = 'http://localhost:3000/api'; 

const api = axios.create({
    baseURL: API_BASE,
});


// services/api.js ထဲမှာ response interceptor ထည့်
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

export default api;