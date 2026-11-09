import axios from "axios"
const playerTeam = axios.create({
    baseURL:'http://localhost:3000/players',
    timeout: 5000,
    headers:{
        'Content-Type':'application/json'
    }
})

playerTeam.interceptors.response.use(
    (response) =>{
        return response },
    (error) =>{
        return Promise.reject(error) }
)

export default playerTeam