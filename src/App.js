import './App.css';
import Main from './routes/Main.js';
import Chat from './routes/Chat.js';
import Login from './routes/Login.js';
import { Routes, Route, useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate();
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/login" element={<Login/>} />
      </Routes>
      <div className='servicesBox'>
        <div className='chatService' onClick={() => {navigate('/chat')}}>채팅방 💬</div>
        <div className='mapService' onClick={() => {navigate('/')}}>홈(지도) 📍</div>
        <div className='loginService' onClick={() => {navigate('/login')}}>로그인 👥</div>
      </div>
    </div>
  );
}

export default App;
