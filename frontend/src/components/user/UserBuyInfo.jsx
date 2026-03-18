export default function UserBuyInfo({ history }) {
  return (
    <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
      <h4>🛒 나의 구매 목록 </h4>
      {history.length === 0 ? (
        <p style={{ color: '#999' }}>아직 구매한 내역이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {history.map((item) => (
            <li key={item._id} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#fff', borderRadius: '4px', borderLeft: '4px solid #4CAF50' }}>
              <strong>{item.productName}</strong> : <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>{item.count}개</span>
            </li>
          ))}
        </ul>
      )}
      <p style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
        총 품목: <strong>{history.length}</strong>종 / 
        총 수량: <strong>{history.reduce((sum, item) => sum + item.count, 0)}</strong>개
      </p>
    </div>
  );
}