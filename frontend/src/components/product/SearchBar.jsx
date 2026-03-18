export default function SearchBar({ searchText, onSearchTextChange }) {
  return (
    <form style={{ marginBottom: '20px' }}>
      <input 
        type="text" 
        placeholder="검색어 입력..."
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
      /> 
    </form>
  );
}