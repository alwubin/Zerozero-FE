import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //validation for email password
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [notAllow, setNotAllow] = useState(true);

    /**
     * CHECKLIST
     * [X] session storage에 로그인 성공 시 받아온 토큰 저장
     * [ ] 로그인 api에서 refreshToken & accessToken 저장소 다르게 저장 필요
     */

    const refreshAccessToken = () => {
        axios.post('http://3.37.245.108:8080/api/v1/auth/refresh-token',
            {
                "refreshToken" : localStorage.getItem('refreshToken')
            }
        )
        .then((res) => {
            if (res.data.success) {
                localStorage.setItem('accessToken', res.data.result.accessToken);
                localStorage.setItem('refreshToken', res.data.result.refreshToken);
            } else {
                //logout
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/';
            }
        })
    }

    const loginUser = () => {
        axios.post('http://3.37.245.108:8080/api/v1/auth/authenticate', 
            {
                'email' : email,
                'password' : password
            },
            { withCredentials: true }
        )
        .then((res) => {
            console.log(res);
            alert('로그인 성공');
            console.log(res.data.result.token);
            //refreshToken & accessToken 저장소 다르게 저장 필요
            localStorage.setItem('accessToken', res.data.result.accessToken);
            localStorage.setItem('refreshToken', res.data.result.refreshToken);
            window.location.href = '/';
        })
        .catch((err) => {
            console.log(err);
            alert('로그인 실패');
        })
    }

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

    useEffect(() => {
        const regex = 
        /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#.~_-])[A-Za-z\d@$!%*?&#.~_-]{8,20}$/
        if(regex.test(password)) {
            setPasswordValid(true);
        } else {
            setPasswordValid(false);
        }
    })

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

                <button className='loginButton' disabled={notAllow} onClick={loginUser}>
                    로그인
                </button>

                <button className='signUpButton' onClick={onClickSignUpButton}>
                    회원가입
                </button>
            </div>

        </div>
    )
}

export default Login;