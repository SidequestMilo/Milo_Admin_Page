import axios from "axios";

const api = axios.create({
    baseURL: "http://3.110.182.233:8000",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
});

api.interceptors.request.use((config) => {
    // Attach token automatically to every request
    config.headers.Authorization = "Bearer dev_admin_token";
    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized: Missing or invalid authentication token.");
        } else if (error.request) {
            console.error("[API Error] No response received from backend or network error.");
        } else {
            console.error("[API Error] " + error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
