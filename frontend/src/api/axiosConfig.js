// frontend/src/api/axiosConfig.js
import axios from 'axios';

// 현재 실행 환경이 'development'(npm start)인지 확인 배포시 (npm run build) 'production'로 변경
const isDevelopment = import.meta.env.DEV;

const baseURL = isDevelopment 
  ? 'http://localhost:5000/api'       // 로컬 개발 시 (스프링 부트)
  : 'http://54.180.151.55:5000/api';  // 배포 후 (실제 서버)

const instance = axios.create({
  baseURL: baseURL
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