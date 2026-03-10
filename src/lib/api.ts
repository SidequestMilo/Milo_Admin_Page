import axios from "axios";

// 1 & 2. Create the Axios instance with the direct backend URL, headers, and timeout
const api = axios.create({
    baseURL: "http://3.110.182.233:8000",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
});

// 3. Add the request interceptor to attach the auth token automatically
api.interceptors.request.use((config) => {
    config.headers.Authorization = "Bearer dev_admin_token";
    return config;
});

// 5. Add a response interceptor to handle 401s and return clean data
api.interceptors.response.use(
    (response) => {
        // Return just the data so callers don't need to do response.data
        return response.data;
    },
    (error) => {
        // Log explicitly if 401 Unauthorized
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized: Missing or invalid authentication token.");
        } else {
            const errData = error.response?.data;
            const message = errData?.message || errData?.detail || error.message;
            console.error('[API Error]', message, error);
        }
        // Return null instead of throwing to allow components to gracefully fallback
        return null;
    }
);

export default api;

export const API_BASE_URL = api.defaults.baseURL;

// 4. Update all exported services to use the new `api` Axios instance
// =======================
// User Services
// =======================

export const getUsers = async (params: { page?: number; limit?: number; user_type?: string; location?: string; search?: string } = {}) => {
    return await api.get('/api/users', { params });
};

export const getUserById = async (id: string) => {
    return await api.get(`/api/users/${id}`);
};

export const getUserSegments = async () => {
    return await api.get('/api/users/segments');
};

export const getUserPreferences = async (telegramId: string) => {
    return await api.get(`/api/preferences/${telegramId}`);
};

// =======================
// Matchmaking & Connections
// =======================

export const getMatches = async (params: { page?: number; limit?: number; status?: string; date_range?: string } = {}) => {
    return await api.get('/api/matches', { params });
};

export const getMatchAnalytics = async () => {
    return await api.get('/api/matches/analytics');
};

export const getConnections = async () => {
    return await api.get('/api/connections');
};

// =======================
// Analytics, Feedback, Activity
// =======================

export const getAnalytics = async () => {
    return await api.get('/api/analytics');
};

export const getFeedback = async () => {
    return await api.get('/api/feedback');
};

export const getActivity = async (params: { user?: string; command?: string; date_range?: string } = {}) => {
    return await api.get('/api/activity', { params });
};

export const getSystemHealth = async () => {
    return await api.get('/api/system-health');
};

export const sendBroadcast = async (data: { audience: string; type: string; message: string }) => {
    return await api.post('/admin/broadcast', data);
};
