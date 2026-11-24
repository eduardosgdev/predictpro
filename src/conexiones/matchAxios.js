import axios from "axios"
const matchTeam = axios.create({
    baseURL:'https://apuestas-jx7n.onrender.com/matchs',
    // baseURL:'http://localhost:3000/matchs',
    timeout: 5000,
    headers:{
        'Content-Type':'application/json'
    }
})

matchTeam.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error("ERROR AXIOS MATCH:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });

        return Promise.reject(error);
    }
);

export default matchTeam