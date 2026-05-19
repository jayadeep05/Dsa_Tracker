import api from './client';

// System Design API endpoints
export const getSystemDesignProgress = () => api.get('/system-design/progress');
export const getSystemDesignTopicProgress = (topicId) => api.get(`/system-design/progress/${topicId}`);
export const updateSystemDesignTopicProgress = (topicId, data) => api.put(`/system-design/progress/${topicId}`, data);
export const getSystemDesignStats = () => api.get('/system-design/stats');
