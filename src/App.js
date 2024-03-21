import './App.css';
import Main from './pages/Main.js';
import Chat from './pages/Chat.js';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp.js';
import MyPage from './pages/MyPage.js';

import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { BiComment } from "react-icons/bi";
import { GiSodaCan } from "react-icons/gi";
import { FaMapPin } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { useEffect, useState } from 'react';

/**
 * CHECKLIST
 * [X] private route 분리 - 마이페이지
 * [X] 로그인 상태에 따라 분리 로그인 페이지 또는 마이페이지로 이동
 * [X] 로그인 시 하단 바 로그인 버튼이 마이페이지 버튼으로 변경
 */


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState('/');
  const [hoveredService, setHoveredService] = useState(null);

  useEffect(() => {
    setIsClicked(location.pathname);
  }, [location.pathname])

  const handleMouseOver = (service) => {
    setHoveredService(service);
  };

  const handleMouseOut = () => {
    setHoveredService(null);
  };

  const navigateAndSetClicked = (path) => {
    navigate(path);
    setIsClicked(path);
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
  
    return !!token; // 있으면 true, 없으면 false 반환
  }

  const handleLoginClick = () => {
    if (isAuthenticated()) {
      setIsClicked('/mypage'); // '/mypage'로 클릭된 상태로 설정
      navigate('/mypage'); // 마이페이지로 이동
    } else {
      setIsClicked('/login'); // '/login'으로 클릭된 상태로 설정
      navigate('/login'); // 로그인 페이지로 이동
    }
  };

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
            element={ isAuthenticated() ? <Navigate to="/mypage" /> : <Login/> } 
        />
        <Route path="/signup" element={<SignUp/>} /> 
        <Route 
            path="/mypage" 
            element={ isAuthenticated() ? <MyPage/> : <Navigate to="/login" /> } 
        />
        <Route path="*" element={<div>잘못된 접근입니다.</div>} /> 
      </Routes>

      {/* Footer: 하단 바 */}
      <div className='servicesBox'>
        <div className='chatService' 
          onClick={() => {navigateAndSetClicked('/chat')}}
          style={{
            ...(isClicked === '/chat' || hoveredService === 'chat' ? clicked : unClicked),
          }}
          onMouseOver={() => handleMouseOver('chat')}
          onMouseOut={handleMouseOut}
          >
          <div className='chatIcon'>
            <BiComment style={{fontSize:'27px'}}/>
            <GiSodaCan style={{zIndex:'1001', fontSize:'12px', position:'absolute', bottom:'33px', left:'104px'}}/>
          </div>
          제보하기
        </div>

        <div className='mapService' 
          onClick={() => {navigateAndSetClicked('/')}}
          style={{
            ...(isClicked === '/' || hoveredService === 'map' ? clicked : unClicked),
          }}
          onMouseOver={() => handleMouseOver('map')}
          onMouseOut={handleMouseOut}
          >
          <div className='mapIcon'>
            <FaMapPin style={{fontSize:'23px', paddingTop:'2px'}}/>
          </div>
          메인
        </div>

        <div className='loginService' 
          onClick={handleLoginClick}
          style={{
            ...((isClicked === '/login' || isClicked === '/mypage') || 
            (hoveredService === 'login' || hoveredService === 'mypage') 
            ? clicked : unClicked),
          }}
          onMouseOver={() => handleMouseOver('login')}
          onMouseOut={handleMouseOut}
          >
          <div className='loginIcon'>
            <AiOutlineUser style={{fontSize:'27px'}}/>
          </div>
          {isAuthenticated() ? '마이페이지' : '로그인'}
        </div>
        
      </div>
    </div>
  );
}

export default App;
