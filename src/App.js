import './App.css';
import Main from './routes/Main.js';
import Chat from './routes/Chat.js';
import Login from './routes/Login.js';
import SignUp from './routes/SignUp.js';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { BiComment } from "react-icons/bi";
import { GiSodaCan } from "react-icons/gi";
import { FaMapPin } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { useState } from 'react';


function App() {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState('/');

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
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} /> 
        <Route path="*" element={<div>잘못된 접근입니다.</div>} /> 
      </Routes>

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
