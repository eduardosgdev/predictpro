import axios from "axios";

const playerstatsAxios = axios.create({
    baseURL: "http://localhost:3000/playerstats",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default playerstatsAxios;