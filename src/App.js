import './App.css';
import Main from './pages/Main.js';
import Chat from './pages/Chat.js';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp.js';
import MyPage from './pages/MyPage.js';

import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { BiComment } from "react-icons/bi";
import { GiSodaCan } from "react-icons/gi";
import { FaMapPin } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { useState } from 'react';

/**
 * CHECKLIST
 * [X] private route 분리 - 마이페이지
 * [X] 로그인 상태에 따라 분리 로그인 페이지 또는 마이페이지로 이동
 * [ ] 로그인 시 하단 바 로그인 버튼이 마이페이지 버튼으로 변경
 */


function App() {
  const [isClicked, setIsClicked] = useState('/');
  const navigate = useNavigate();

  const isAuthoenticated = () => {
    const token = localStorage.getItem('token');
  
    return !!token; // 있으면 true, 없으면 false 반환
  }

  const clicked = {
    backgroundColor:'#fffafa',
    color: '#CD5C5C',
  }

  const unClicked = {
    backgroundColor:'#fffafa',
    color: '#262626',
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route 
            path="/login" 
            element={ isAuthoenticated() ? <Navigate to="/mypage" /> : <Login/> } 
        />
        <Route path="/signup" element={<SignUp/>} /> 
        <Route 
            path="/mypage" 
            element={ isAuthoenticated() ? <MyPage/> : <Navigate to="/login" /> } 
        />
        <Route path="*" element={<div>잘못된 접근입니다.</div>} /> 
      </Routes>

      {/* Footer: 하단 바 */}
      <div className='servicesBox'>
        <div className='chatService' 
          onClick={() => {
            navigate('/chat');
            setIsClicked('/chat');
          }}
          style={isClicked === '/chat' ? clicked : unClicked}>
          <div className='chatIcon'>
            <BiComment style={{fontSize:'27px'}}/>
            <GiSodaCan style={{zIndex:'1001', fontSize:'12px', position:'absolute', bottom:'33px', left:'104px'}}/>
          </div>
          채팅방 
        </div>

        <div className='mapService' 
          onClick={() => {
            navigate('/');
            setIsClicked('/');
          }}
          style={isClicked === '/' ? clicked : unClicked}>
          <div className='mapIcon'>
            <FaMapPin style={{fontSize:'23px', paddingTop:'2px'}}/>
          </div>
          메인
        </div>

        <div className='loginService' 
          onClick={() => {
            navigate('/login');
            setIsClicked('/login');
          }}
          style={isClicked === '/login' ? clicked : unClicked}>
          <div className='loginIcon'>
            <AiOutlineUser style={{fontSize:'27px'}}/>
          </div>
          로그인
        </div>
        
      </div>
    </div>
  );
}

export default App;
