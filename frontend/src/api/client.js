import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        const isAuthEndpoint = error.config?.url?.includes('/auth/');
        if (error.response && error.response.status === 401 && !isAuthEndpoint) {
            // Unauthorized on a protected route — session expired
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);

export const getPatterns = () => api.get('/patterns');
export const getPatternQuestions = (id) => api.get(`/patterns/${id}/questions`);
export const getQuestion = (id) => api.get(`/questions/${id}`);
export const updateProgress = (id, data) => api.put(`/questions/${id}/progress`, data);
export const getDashboard = () => api.get('/dashboard');
export const getStreak = () => api.get('/streak');
export const getDailyLog = (days = 30) => api.get(`/daily-log?days=${days}`);
export const getSpecialList = (name) => api.get(`/special-lists/${name}`);
export const searchQuestions = (params) => api.get('/questions/search', { params });
export const getNeedsRevision = () => api.get('/questions/needs-revision');

export default api;
