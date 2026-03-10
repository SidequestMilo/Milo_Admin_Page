import api from './api';

export const getUsers = async () => {
    try {
        const response = await api.get('/api/users');
        // Return .data directly so caller only gets the actual clean array/object
        return response.data;
    } catch (error) {
        console.error('Failed to fetch users', error);
        return null;
    }
};

export const getConnections = async () => {
    try {
        const response = await api.get('/api/connections');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch connections', error);
        return null;
    }
};

export const getMatches = async () => {
    try {
        const response = await api.get('/api/matches');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch matches', error);
        return null;
    }
};

export const getAnalytics = async () => {
    try {
        const response = await api.get('/api/analytics');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch analytics', error);
        return null;
    }
};

export const getUserSegments = async () => {
    try {
        const response = await api.get('/api/users/segments');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch segments', error);
        return null;
    }
};

export const getMatchAnalytics = async () => {
    try {
        const response = await api.get('/api/matches/analytics');
        return response.data;
    } catch (error) {
        return null;
    }
};

export const getFeedback = async () => {
    try {
        const response = await api.get('/api/feedback');
        return response.data;
    } catch (error) {
        return null;
    }
};

export const getActivity = async () => {
    try {
        const response = await api.get('/api/activity');
        return response.data;
    } catch (error) {
        return null;
    }
};

export const getSystemHealth = async () => {
    try {
        const response = await api.get('/api/system-health');
        return response.data;
    } catch (error) {
        return null;
    }
};

export const getUserByTelegramId = async (id) => {
    try {
        const response = await api.get(`/api/users/${id}`);
        return response.data;
    } catch (error) {
        return null;
    }
};

export const getUserPreferences = async (id) => {
    try {
        const response = await api.get(`/api/preferences/${id}`);
        return response.data;
    } catch (error) {
        return null;
    }
};
