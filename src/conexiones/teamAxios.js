import axios from "axios";

const apiTeams = axios.create({
    
     baseURL:'http://localhost:3000/teams',
    timeout: 5000,
    headers:{
        'Content-Type':'application/json'
    }
})

apiTeams.interceptors.response.use(
    (response) =>{
        return response},
    (error) =>{
        return Promise.reject(error)}
)

export default apiTeams;

