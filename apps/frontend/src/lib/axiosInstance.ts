import { config } from "@/config";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: config.PRIMARY_BACKEND_URL,
    withCredentials: true,
});


axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
        config.headers.Authorization = `${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(`${config.PRIMARY_BACKEND_URL}/api/v1/user/refresh`,
                    {},
                    {

                        withCredentials: true,
                    }
                );

                const newAccessToken = res.data.accessToken;
                localStorage.setItem("token", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed", refreshError);
                //Redirect to login
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;