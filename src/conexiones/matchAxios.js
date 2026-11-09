import axios from "axios"
const matchTeam = axios.create({
    baseURL:'http://localhost:3000/matchs/teammatch',
    timeout: 5000,
    headers:{
        'Content-Type':'application/json'
    }
})

matchTeam.interceptors.response.use(
    (response) =>{
        return response },
    (error) =>{
        return Promise.reject(error) }
)

export default matchTeam