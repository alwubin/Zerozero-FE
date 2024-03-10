import React, { useEffect, useState } from 'react'; 
import axios from 'axios';

import ProfileUploader from '../components/ProfileUploader';
import PopUp from '../components/PopUp';
import '../styles/MyPage.css';
import { HiPencil } from "react-icons/hi";

/**
 * CHECKLIST
 * [ ] 버튼을 통해 프로필 사진 & 닉네임 변경 함수 작성
 * [ ] 내 랭킹 계산 함수 (?? 어떻게 작성하지 .. 계산 식부터 생각)
 * [ ] 제보한 횟수 계산 함수 작성
 * [ ] 내가 등록한 장소 숫자로 표시하고 클릭 시 목록 보여주기
 */

function MyPage() {
    const [nickname, setNickname] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [rank, setRank] = useState('');
    const [storeReportCount, setStoreReportCount] = useState(0);

    const [showUploader, setShowUploader] = useState(false);

    const toggleUploader = () => {
        setShowUploader(prevState => !prevState);
    }

    const logoutUser = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    useEffect(() => {
        // 토큰이 없을 때 로그인 페이지로 이동
        if (!localStorage.getItem('token')) {
            window.location.href = '/';
        } else {
            // inquireMyPage 함수 호출
            inquireMyPage();
        }
    }, []);

    const inquireMyPage = () => {
        axios.get(`http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/users/my-page`, { 
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            } 
        })
        .then((res) => {
            console.log(res.data.result);
            const myInfo = res.data.result;
            setNickname(myInfo.nickname);
            setProfileImage(myInfo.profileImage);
            if (myInfo.rank === -1) {
                setRank('Unranked');
            } else {
                setRank(`${myInfo.rank}`);
            }
            setStoreReportCount(myInfo.storeReportCount);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    return (
        <div className='myPage'>
            <div className='myPageTitleWrap'>
                마이 페이지
            </div>
            <div className='myPageContentWrap'>
                <div className='profile'>
                    <div className='myImage'>
                        <img className='profileImage' src={profileImage || 'images/default.png'} alt='프로필 이미지'/>
                    </div>
                    <div className='myName'>
                        {nickname}
                    </div>
                    <div className='editButton' onClick={toggleUploader}><HiPencil/></div>
                </div>
                
                <div className='editProfileWrap'>
                { showUploader && <PopUp content={<ProfileUploader onClose={toggleUploader} profileImage={profileImage} setProfileImage={setProfileImage} />} onClose={toggleUploader} /> }
                </div>

                <div className='myActivities'>
                    <div className='activity' >
                        <div className='value' 
                            style={rank === 'Unranked' ? 
                            { fontSize: '17px',  marginTop: '28px',  color: '#515163' } : 
                            { marginTop: '5px', fontSize: '40px', fontWeight: '700',  color: '#EAE8E5'}}>
                            {rank}
                        </div>
                        <div className='valueTitle'>
                            내 랭킹
                        </div>
                    </div>
                    <div className='activity' >
                        <div className='value'>
                            {storeReportCount}
                        </div>
                        <div className='valueTitle'>
                            내가 등록한 장소
                        </div>
                    </div>
                </div>

                <button className='logoutButton' onClick={logoutUser}>
                    로그아웃
                </button>
            </div>
        </div>
    );
}

export default MyPage;