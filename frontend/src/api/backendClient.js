import api from './client';

// Backend Prep API endpoints
export const getBackendProgress = () => api.get('/backend/progress');
export const getTopicProgress = (topicId) => api.get(`/backend/progress/${topicId}`);
export const updateTopicProgress = (topicId, data) => api.put(`/backend/progress/${topicId}`, data);
export const getCheckpointResults = (phaseId) => api.get(`/backend/checkpoint/${phaseId}`);
export const submitCheckpoint = (phaseId, data) => api.post(`/backend/checkpoint/${phaseId}`, data);
export const getBackendStats = () => api.get('/backend/stats');
