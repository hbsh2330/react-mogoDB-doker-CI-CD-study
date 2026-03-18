// frontend/src/api/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.100.75:5000/api'
});

// [Interceptor 설정] 요청을 보내기 직전에 가로채서 토큰을 넣어줍니다.
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // 서버 미들웨어에서 split(" ")[1]로 받기로 했으므로 Bearer 형식을 맞춰줍니다.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;