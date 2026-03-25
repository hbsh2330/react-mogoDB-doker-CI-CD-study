// frontend/src/api/axiosConfig.js
import axios from 'axios';

// 1. 현재 브라우저의 접속 주소를 자동으로 가져옵니다 (가장 확실한 방법)
const hostname = window.location.hostname;

// 2. 접속한 주소가 localhost면 로컬 백엔드를, 아니면 AWS IP를 사용합니다.
// 이렇게 하면 스프링이든 노드든 포트 5000번만 맞으면 똑같이 작동합니다.
const baseURL = (hostname === 'localhost' || hostname === '127.0.0.1')
  ? 'http://localhost:5000/api'           // 로컬 개발 환경
  : `http://${hostname}:5000/api`;       // AWS 배포 환경 (자동으로 현재 IP 사용)
  
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