import axios from "axios";

const playerstatsAxios = axios.create({
    baseURL: "https://apuestas-jx7n.onrender.com/playerstats",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default playerstatsAxios;