import React, { useEffect, useState } from 'react'; 
import CustomAlert from '../components/CustomAlert';
import axios from 'axios';
import '../styles/SignUp.css'

/**
 * CHECKLIST
 * [X] 중복 확인 성공 시 '사용 가능한 이메일/닉네임 입니다' 띄우기
 * [X] 팝업 창 모달로 작성해서 가져오기
 */

function SignUp() {
    const [email, setEmail] = useState('');
    const [emailOpt, setEmailOpt] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [nickname, setNickname] = useState('');

    //for Alert modal
    const [showEmailAlert, setShowEmailAlert] = useState(false);
    const [showNicknameAlert, setShowNicknameAlert] = useState(false);

    //duplicate for email password nickname
    const [emailDuplicate, setEmailDuplicate] = useState(true);
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [nicknameDuplicate, setNicknameDuplicate] = useState(true);
    const [isEmpty, setIsEmpty] = useState(true);
    const [emailNotAllow, setEmailNotAllow] = useState(false);
    const [nicknameNotAllow, setNicknameNotAllow] = useState(true);
   
    const registerUser = () => {
        axios.post('http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/register', 
            {
                'nickname': nickname,
                'email': `${email}@${emailOpt}`,
                'password': password
            },
            { withCredentials: true }
        )
        .then((res) => {
            console.log(res);
            alert('회원가입 성공');
            window.location.href = '/login';
        })
        .catch((err) => {
            console.log(err);
            alert('회원가입 실패');
        })
    }

    const checkEmailDuplication = () => {
        axios.get(`http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/check-email/${encodeURIComponent(email+'@'+emailOpt)}`, { withCredentials: true })
        .then((res) => {
            console.log(res);
        })
        .catch(() => {
            console.log('이미 존재하는 이메일 입니다.');
            setEmailDuplicate(false);
        })
        setEmailDuplicate(true);
        setShowEmailAlert(true); 
    }

    const checkNicknameDuplication = () => {
        axios.get(`http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/auth/check-nickname/${encodeURIComponent(nickname)}`, { withCredentials: true })
        .then((res) => {
            console.log(res);
        })
        .catch(() => {
            console.log('이미 존재하는 닉네임 입니다.');
            setNicknameDuplicate(false);
        })
        setNicknameDuplicate(true);
        setShowNicknameAlert(true); 
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleEmailOpt = (e) => {
        setEmailOpt(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
        const regex = 
        /^.*(?=^.{7,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        if(regex.test(password)) {
            setPasswordValid(true);
        } else {
            setPasswordValid(false);
        }
    }

    const handlePasswordCheck = (e) => {
        setPasswordCheck(e.target.value);
    }

    const handleNickname = (e) => {
        setNickname(e.target.value);
    }

    useEffect(() => {
        if(password === passwordCheck) {
            setPasswordMatch(true);
        } else {
            setPasswordMatch(false);
        }
    })

    useEffect(() => {
        const regex = 
        /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        
        if (regex.test(email + '@' + emailOpt)) {
            setEmailNotAllow(false);
        } else {
            setEmailNotAllow(true);
        }
    })

    //공백 없는 숫자 한글 문자
    useEffect(() => {
        const regex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]{2,10}$/;
        if (regex.test(nickname)) {
            setNicknameNotAllow(false);
        } else {
            setNicknameNotAllow(true);
        }
    })

    useEffect(() => {
        if (
            email === '' || 
            emailOpt === '' || 
            password === '' || 
            passwordCheck === '' || 
            nickname === ''
            ) {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
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
                    <div className='signUpSuccessMsgWrap'>
                        {
                            showEmailAlert && (
                                <CustomAlert 
                                message='사용 가능한 이메일입니다!'/>
                            )
                        }
                    </div>
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

                        <input
                                type='text'
                                className='signUpEmailInput'
                                name='emailSelected'
                                value={emailOpt}
                                readOnly/>
                            
                        <select
                            className='signUpOptInput'
                            name='emailOpt'
                            id='emailOpt'
                            onChange={handleEmailOpt}
                            value={emailOpt}>
                            <option disabled value=''>-- 선택 --</option>
                            <option value='naver.com'>naver.com</option>
                            <option value='gmail.com'>gmail.com</option>
                            <option value='hanmail.net'>hanmail.net</option>
                            <option value='daum.net'>daum.net</option>
                            <option value='nate.com'>nate.com</option>
                            <option value='yahoo.com'>yahoo.com</option>
                            <option value='kakao.com'>kakao.com</option>
                        </select>
                    </form>
                    <button className='checkDuplicateButton' disabled={emailNotAllow} onClick={checkEmailDuplication}>중복확인</button>
                    
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
                            !passwordMatch && passwordCheck.length > 0 && (
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
                    <div className='signUpSuccessMsgWrap'>
                        {
                            showNicknameAlert && (
                                <CustomAlert 
                                message='사용 가능한 닉네임입니다!'/>
                            )
                        }
                    </div>
                    <div className='signUpErrorMsgWrap'>
                        {
                            !nicknameDuplicate && (
                                <div>이미 존재하는 닉네임입니다.</div>
                            )
                        }
                    </div>
                </div>

                <div className='signUpInputWrap'>
                    <input
                        type='text' 
                        className='signUpInput' 
                        placeholder='닉네임 입력'
                        onChange={handleNickname}
                    />
                    <button className='checkDuplicateButton' disabled={nicknameNotAllow} onClick={checkNicknameDuplication}>중복확인</button>
                </div>

                <button className='joinButton' disabled={isEmpty} onClick={registerUser}>가입하기</button>
                <button className='cancelButton'>취소</button>
            </div>
        </div>
    )

}

export default SignUp;