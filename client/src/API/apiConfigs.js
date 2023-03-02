import axios from 'axios'

export const apiConfig = axios.create({
    baseURL: "http://localhost:8080/api",
    withCredentials: true
})