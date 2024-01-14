import React, { useEffect, useState } from 'react';
import '../static/Login.css';

const User = { //사용자 데이터
    email: 'Zerozero@gmail.com',
    pw: 'Zerozero123@'
}


function Login() {
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');

    //validation for email password
    const [emailValid, setEmailValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const [notAllow, setNotAllow] = useState(true);

    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex = 
            /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if(regex.test(e.target.value)) {
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    }

    const handlePw = (e) => {
        setPw(e.target.value);
        const regex = 
            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        if(regex.test(pw)) {
            setPwValid(true);
        } else {
            setPwValid(false);
        }
    }

    const onClickConfirmButton = () => {
        if(email === User.email && pw === User.pw) {
            alert('로그인에 성공했습니다.');
        } else {
            alert('등록되지 않은 사용자입니다.')
        }
    }

    //vaild state값 변화가 있을 때마다 실행 
    useEffect(() => {
        if (emailValid && pwValid) {
            setNotAllow(false);
            return;
        }
        setNotAllow(true);
    },[emailValid, pwValid])

    return (
        <div className='loginPage'>
            <div className='titleWrap'>
                이메일과 비밀번호를
                <br/>
                입력해주세요
            </div>

            <div className='contentWrap'>
                <div className='inputTitle'>이메일 주소</div>
                <div className='inputWrap'>
                    <input
                        type='text' 
                        className='input' 
                        placeholder='Zerozero@gmail.com'
                        value={email}
                        onChange={handleEmail}/>
                </div>
                <div className='errorMsgWrap'>
                    {
                        !emailValid && email.length > 0 && (
                            <div>올바른 이메일을 입력해주세요.</div>
                        )
                    }
                </div>


                <div className='inputTitle' style={{ marginTop: "26px" }}>
                    비밀번호
                </div>
                <div className='inputWrap'>
                    <input
                        type='password' 
                        className='input'
                        placeholder='영문, 숫자, 특수문자 포함 8자 이상'
                        value={pw}
                        onChange={handlePw}
                    />
                </div>
                <div className='errorMsgWrap'>
                    {
                        !pwValid && pw.length > 0 && (
                            <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                        )
                    }
                </div>

                <button className='loginButton' disabled={notAllow} onClick={onClickConfirmButton}>
                    확인
                </button>

                <button className='joinButton'>
                    회원가입
                </button>
            </div>

        </div>
    )
}

export default Login;