import './App.css';
import NaverMap from './routes/NaverMap.js';
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <h1>🥤 모두가 만들어가는 제로 음료수 판매점 찾기 서비스 🚘</h1>
      <Routes>
        <Route path="/" element={<NaverMap />} />
      </Routes>
    </div>
  );
}

export default App;
