import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import '../static/SignUp.css'


function SignUp() {
    const [email, setEmail] = useState('');
    const [emailOpt, setEmailOpt] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [nickname, setNickname] = useState('');

    //duplicate for email password nickname
    const [emailDuplicate, setEmailDuplicate] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [nicknameDuplicate, setNicknameDuplicate] = useState(false);
    const [notAllow, setNotAllow] = useState(true);

    const checkEmailDuplication = () => {
        axios.get(`http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/check-email/${email}%40${emailOpt.value}`)
        .then((res) => {
            console.log(res);
        })
        .catch(() => {
            console.log('이미 존재하는 이메일 입니다.');
            setEmailDuplicate(true);
        })
        setEmailDuplicate(false);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleEmailOpt = (e) => {
        setEmailOpt(e.target.value);

        if (e.target.value === 'type') {
            document.getElementsByName('emailSelected')[0].value = '';
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

    const handlePasswordCheck = (e) => {
        setPasswordCheck(e.target.value);
        if (password !== passwordCheck) {
            setPasswordMatch(true);
        } else {
            setPasswordMatch(false);
        }
    }


    useEffect(() => {
        const regex = 
        /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        
        if (regex.test(email)) {
            setNotAllow(false);
        } else {
            setNotAllow(true);
        }
    })

    return (
        <div className="signUpPage">
            <div className='signUpTitleWrap'>
                <p className='signUpTitle'>회원가입</p>
                <p className='signUpSubTitle'>회원이 되어 더 많은 기능을 사용해보세요!</p>
            </div>

            <div className='signUpContentWrap'>
                <div className='signUpInputTitleWrap'>
                    <div className='signUpInputTitle'>이메일 주소</div>
                    <div className='signUpErrorMsgWrap'>
                        {
                            !emailDuplicate && (
                                <div>이미 존재하는 이메일 입니다.</div>
                            )
                        }
                    </div>
                </div>

                <div className='signUpInputWrap'>
                    <form name='emailForm'>
                        <input
                            type='text' 
                            className='signUpEmailInput' 
                            placeholder='이메일 입력'
                            value={email}
                            onChange={handleEmail}
                        /> @ &nbsp; 
                        {emailOpt === 'type' ? (
                            <input
                                type='text'
                                className='signUpEmailInput'
                                name='emailSelected'/>
                            ) : (
                            <input
                                type='text'
                                className='signUpEmailInput'
                                name='emailSelected'
                                value={emailOpt}
                                readOnly/>
                            )
                        }
                        <select
                            className='signUpOptInput'
                            name='emailOpt'
                            id='emailOpt'
                            onChange={handleEmailOpt}
                            value={emailOpt}>
                            <option value='type'>직접 입력</option>
                            <option value='naver.com'>naver.com</option>
                            <option value='gmail.com'>gmail.com</option>
                            <option value='hanmail.net'>hanmail.net</option>
                            <option value='daum.net'>daum.net</option>
                            <option value='nate.com'>nate.com</option>
                            <option value='yahoo.com'>yahoo.com</option>
                            <option value='kakao.com'>kakao.com</option>
                        </select>
                    </form>
                    <button className='checkDuplicateButton' disabled={notAllow} onClick={checkEmailDuplication}>중복확인</button>
                    
                </div>

                <div className='signUpInputTitleWrap'>
                    <div className='signUpInputTitle'>비밀번호</div>
                    <div className='signUpErrorMsgWrap'>
                        {
                            !passwordValid && password.length > 0 && (
                                <div>영문, 숫자, 특수문자 포함 8자 이상 20자 미만으로 입력해주세요.</div>
                            )
                        }
                    </div>
                </div>

                <div className='signUpInputWrap'>
                    <input
                        type='password' 
                        className='signUpInput' 
                        placeholder='비밀번호 입력 (영문, 숫자, 특수문자 포함 8-20자)'
                        value={password}
                        onChange={handlePassword}
                    />
                </div>

                <div className='signUpInputTitleWrap'>
                    <div className='signUpInputTitle'>비밀번호 확인</div>
                    <div className='signUpErrorMsgWrap'>
                        {
                            !passwordMatch && (
                                <div>비밀번호가 일치하지 않습니다.</div>
                            )
                        }
                    </div>
                </div>

                <div className='signUpInputWrap'>
                    <input
                        type='password' 
                        className='signUpInput' 
                        placeholder='비밀번호 재입력'
                        value={passwordCheck}
                        onChange={handlePasswordCheck}
                    />
                </div>

                <div className='signUpInputTitleWrap'>
                    <div className='signUpInputTitle'>닉네임</div>
                    <div className='signUpErrorMsgWrap'>
                        <div>사용하실 닉네임을 입력해주세요.</div>
                    </div>
                </div>
                <div className='signUpInputWrap'>
                    <input
                        type='text' 
                        className='signUpInput' 
                        placeholder='닉네임 입력'
                    />
                    <button className='checkDuplicateButton' disabled={true}>중복확인</button>
                </div>

                <button className='joinButton'>가입하기</button>
                <button className='cancelButton'>취소</button>
            </div>
        </div>
    )

}

export default SignUp;