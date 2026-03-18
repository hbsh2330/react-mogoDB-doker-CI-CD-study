import { useState, useEffect } from 'react';
import api from './api/axiosConfig'; 
import ProductTable from './components/product/ProductTable';
import SearchBar from './components/product/SearchBar';
import UserBuyInfo from './components/user/UserBuyInfo';
import Login from './components/user/Login';

export default function App() {
  // --- [1. 상태 관리] ---
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [gold, setGold] = useState(0);
  const [user, setUser] = useState(null);

  const filteredProducts = products.filter(p => p.name.includes(searchText));

  // --- [2. 초기 데이터 로드] ---
  useEffect(() => {
    // 상품 목록 로드
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("상품 로드 실패:", err));

    // 로그인 유지 및 구매 내역 로드
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/me')
        .then(res => {
          setUser(res.data);
          setGold(res.data.gold);
          // 로그인 성공 후 연달아 구매 내역 로드
          return api.get('/users/orders');
        })
        .then(res => setHistory(res.data))
        .catch(err => {
          console.error("세션 만료 또는 데이터 로드 실패:", err);
          handleLogout();
        });
    }
  }, []);

  // --- [3. 핸들러 함수들] ---

  // A. 로그인/로그아웃 관련
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setGold(userData.gold);
    api.get('/users/orders')
      .then(res => setHistory(res.data))
      .catch(err => console.error("구매 내역 로드 실패:", err));
  };

  const handleLogout = () => {
    setUser(null);
    setGold(0);
    setHistory([]);
    localStorage.removeItem('token');
  };

  // B. 잔액 충전 관련
  const addGold = () => {
    const amountToAdd = 10000;
    api.put('/users/add-gold', { amount: amountToAdd })
      .then(res => {
        setGold(res.data.gold);
        alert("✅ 10,000원이 성공적으로 충전되었습니다!");
      })
      .catch(err => alert("❌ 충전 실패: " + err.message));
  };

  // C. 상품 구매 관련 (핵심 리팩토링)
  const handleBuy = (product) => {
    if (!user) return alert("로그인이 필요합니다!");
    if (gold < product.price) return alert("돈이 부족합니다!");

    api.patch(`/products/${product.name}`, { 
      stockChange: -1, 
      price: product.price 
    })
    .then(res => {
      const updatedProduct = res.data;
      // 화면 즉시 반영 (잔액 & 재고)
      setGold(prev => prev - product.price);
      setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
      
      // 최신 구매 내역 동기화
      return api.get('/users/orders');
    })
    .then(res => {
      setHistory(res.data);
      alert(`✅ ${product.name} 구매 완료!`);
    })
    .catch(err => {
      if (err.response?.status === 401) {
        alert("세션이 만료되었습니다.");
        handleLogout();
      } else {
        alert("구매 에러: " + (err.response?.data?.message || "서버 응답 없음"));
      }
    });
  };

  // D. 재고 추가 관련
  const handleAdd = (product) => {
    api.patch(`/products/${product.name}`, { stockChange: 1 })
      .then(res => {
        const updatedProduct = res.data;
        setProducts(prev => prev.map(p => p._id === updatedProduct._id ? updatedProduct : p));
      })
      .catch(() => alert("재고 추가 에러"));
  };

  // --- [4. 렌더링 영역] ---
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* 유저 세션 영역 */}
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f4f8', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{user.userId}</strong>님 환영합니다!
            <h3 style={{ color: '#2c3e50', margin: '5px 0' }}>현재 잔액: {gold.toLocaleString()}원</h3>
          </div>
          <div>
            <button onClick={addGold} style={{ marginRight: '10px', padding: '8px 12px' }}>💰 충전</button>
            <button onClick={handleLogout} style={{ padding: '8px 12px', backgroundColor: '#ff7675', color: 'white', border: 'none', borderRadius: '5px' }}>로그아웃</button>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      {user && (
        <>
          <hr style={{ margin: '20px 0', opacity: 0.2 }} />
          <SearchBar searchText={searchText} onSearchTextChange={setSearchText} />
          
          <div style={{ marginTop: '20px' }}>
            <ProductTable 
              products={filteredProducts} 
              onBuyClick={handleBuy} 
              onAddClick={handleAdd} 
            />
          </div>

          <div style={{ marginTop: '30px' }}>
            <UserBuyInfo history={history} />
          </div>
        </>
      )}
    </div>
  );
}