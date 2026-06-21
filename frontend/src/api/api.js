import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8000/api/",
})

API.interceptors.request.use((req) => {
    const token =
        sessionStorage.getItem("access") ||
        localStorage.getItem("access");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    
    if (req.data instanceof FormData) {
        delete req.headers['Content-Type'];
    }
    
    return req;
});

export default API;