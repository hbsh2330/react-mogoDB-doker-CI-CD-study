export default function ProductTable({ products, onBuyClick, onAddClick }) {
  return (
    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>이름</th><th>가격</th><th>재고</th><th>구매</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            <td>{product.name}</td>
            <td>{product.price.toLocaleString()}원</td>
            <td style={{ color: product.stock === 0 ? 'red' : 'black' }}>
              {product.stock === 0 ? "품절" : `${product.stock}개`}
              <button onClick={() => onAddClick(product)} style={{ marginLeft: '10px' }}>추가</button>
            </td>
            <td>
              <button onClick={() => onBuyClick(product)} disabled={product.stock === 0}>구매</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}