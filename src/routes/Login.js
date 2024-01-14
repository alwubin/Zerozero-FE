import React, { useEffect, useState } from 'react';
import '../static/Login.css';

const User = { //사용자 데이터
    email: 'Zerozero@gmail.com',
    password: 'Zerozero123@'
}


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //validation for email password
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
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

    const handlePassword = (e) => {
        setPassword(e.target.value);
        const regex = 
            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        if(regex.test(password)) {
            setPasswordValid(true);
        } else {
            setPasswordValid(false);
        }
    }

    const onClickConfirmButton = () => {
        if(email === User.email && password === User.password) {
            alert('로그인에 성공했습니다.');
        } else {
            alert('등록되지 않은 사용자입니다.')
        }
    }

    const onClickSignUpButton = () => {
        alert('회원가입 페이지로 이동합니다.');
        window.location.href = '/signup';
    }

    //vaild state값 변화가 있을 때마다 실행 
    useEffect(() => {
        if (emailValid && passwordValid) {
            setNotAllow(false);
            return;
        }
        setNotAllow(true);
    },[emailValid, passwordValid])

    return (
        <div className='loginPage'>
            <div className='loginTitleWrap'>
                이메일과 비밀번호를
                <br/>
                입력해주세요
            </div>

            <div className='loginContentWrap'>
                <div className='loginInputTitle'>이메일 주소</div>
                <div className='loginInputWrap'>
                    <input
                        type='text' 
                        className='loginInput' 
                        placeholder='Zerozero@gmail.com'
                        value={email}
                        onChange={handleEmail}/>
                </div>
                <div className='loginErrorMsgWrap'>
                    {
                        !emailValid && email.length > 0 && (
                            <div>올바른 이메일을 입력해주세요.</div>
                        )
                    }
                </div>


                <div className='loginInputTitle' style={{ marginTop: "26px" }}>
                    비밀번호
                </div>
                <div className='loginInputWrap'>
                    <input
                        type='password' 
                        className='loginInput'
                        placeholder='영문, 숫자, 특수문자 포함 8자 이상'
                        value={password}
                        onChange={handlePassword}
                    />
                </div>
                <div className='loginErrorMsgWrap'>
                    {
                        !passwordValid && password.length > 0 && (
                            <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                        )
                    }
                </div>

                <button className='loginButton' disabled={notAllow} onClick={onClickConfirmButton}>
                    확인
                </button>

                <button className='signUpButton' onClick={onClickSignUpButton}>
                    회원가입
                </button>
            </div>

        </div>
    )
}

export default Login;