import { useState } from 'react';
import api from '../../api/axiosConfig'; // 우리가 만든 인터셉터 적용된 api

export default function Login({ onLoginSuccess }) {
  const [info, setInfo] = useState({ userId: '', password: '' });
  const [isRegister, setIsRegister] = useState(false); // 회원가입 모드 여부

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 모드에 따라 주소 분기 (register 또는 login)
    const url = isRegister ? '/users/register' : '/users/login';
    
    try {
      const res = await api.post(url, info);
      
      if (isRegister) {
        alert("회원가입 성공! 이제 로그인해주세요.");
        setIsRegister(false); // 가입 성공 후 로그인 모드로 전환
      } else {
        // 로그인 성공 시
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        onLoginSuccess(user);
      }
    } catch (err) {
      alert(err.response?.data || "요청 실패");
    }
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #4CAF50', borderRadius: '8px' }}>
      <h4 style={{ color: '#4CAF50' }}>{isRegister ? "🌱 회원가입" : "🔑 로그인"}</h4>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="아이디 입력" 
          style={{ padding: '8px', marginRight: '5px' }}
          onChange={e => setInfo({...info, userId: e.target.value})} 
          required
        />
        <input 
          type="password" 
          placeholder="비밀번호 입력" 
          style={{ padding: '8px', marginRight: '5px' }}
          onChange={e => setInfo({...info, password: e.target.value})} 
          required
        />
        <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isRegister ? "가입하기" : "로그인"}
        </button>
      </form>
      
      <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
        {isRegister ? "이미 계정이 있으신가요?" : "처음 오셨나요?"}
        <button 
          onClick={() => setIsRegister(!isRegister)} 
          style={{ background: 'none', border: 'none', color: '#2196F3', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }}
        >
          {isRegister ? "로그인하러 가기" : "회원가입 하기"}
        </button>
      </p>
    </div>
  );
}