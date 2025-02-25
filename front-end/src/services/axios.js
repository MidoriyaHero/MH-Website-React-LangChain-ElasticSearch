import axios from 'axios';

const baseURL = 'http://34.81.97.201/api/v1';

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response, 
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
