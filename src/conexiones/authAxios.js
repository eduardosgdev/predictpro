
import axios from "axios";

const user = axios.create({
    baseURL: 'https://apuestas-jx7n.onrender.com/users',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor de peticiones
user.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuestas
user.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default user;
