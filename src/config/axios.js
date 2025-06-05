import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor për kërkesat
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor për përgjigjet
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nëse gabimi është 401 dhe nuk kemi provuar të rifreskojmë token-in
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Provoni të rifreskoni token-in
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('Nuk ka refresh token');
                }

                const response = await axios.post('http://localhost:5000/api/auth/refresh-token', {
                    refreshToken
                });

                const { token } = response.data;
                localStorage.setItem('token', token);

                // Përditëso header-in e autorizimit dhe provo përsëri kërkesën
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return instance(originalRequest);
            } catch (refreshError) {
                // Nëse rifreskimi i token-it dështon, çkyçu përdoruesin
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Trajto gabimet e tjera
        const errorMessage = error.response?.data?.message || 'Ndodhi një gabim. Ju lutemi provoni përsëri.';
        return Promise.reject({
            message: errorMessage,
            status: error.response?.status
        });
    }
);

// Objekt ndihmës për metodat e zakonshme
export const api = {
    get: (url, config) => instance.get(url, config),
    post: (url, data, config) => instance.post(url, data, config),
    put: (url, data, config) => instance.put(url, data, config),
    delete: (url, config) => instance.delete(url, config),
    patch: (url, data, config) => instance.patch(url, data, config)
};

export default instance; 