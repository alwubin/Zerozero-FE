import React, { useEffect, useState } from 'react'; 
import '../styles/MyPage.css';

/**
 * CHECKLIST
 * [ ] 버튼을 통해 프로필 사진 & 닉네임 변경 함수 작성
 * [ ] 내 랭킹 계산 함수 (?? 어떻게 작성하지 .. 계산 식부터 생각)
 * [ ] 제보한 횟수 계산 함수 작성
 * [ ] 내가 등록한 장소 숫자로 표시하고 클릭 시 목록 보여주기
 */

function MyPage() {
    const logoutUser = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    useEffect(() => {
        if(!localStorage.getItem('token')) {
            window.location.href = '/';
        }
    }, [])

    return (
        <div className='myPage'>
            <div className='myPageTitleWrap'>
                마이 페이지
            </div>
            <div className='myPageContentWrap'>
                {/* <div className='myBadge'>👑</div> */}
                <div className='profile'>
                    <div className='myImage'>
                        {/* 프로필 이미지 */}
                        <img className='profileImage' src='profile.jpeg'/>
                    </div>
                    <div className='myName'>
                        {/* 닉네임 */}
                        호빵이는제로칼로리
                    </div>
                    <button className='editButton'>✏️</button>
                </div>

                <div className='myActivities'>
                    <div className='activity' style={{marginRight:'20px'}}>
                        <div className='value'>
                            0
                        </div>
                        <div className='valueTitle'>
                            내 랭킹 👑
                        </div>
                    </div>
                    <div className='activity' style={{marginRight:'20px'}}>
                        {/* {Number} = 제보한 횟수를 숫자로 표시 */}
                        <div className='value'>
                            0
                        </div>
                        <div className='valueTitle'>
                            제보한 횟수 📢
                        </div>
                    </div>
                    <div className='activity'>
                        {/* {Number} = 제보한 장소를 숫자로 표시 */} 
                        <div className='value'>
                            0
                        </div>
                        <div className='valueTitle'>
                            내가 등록한 장소 🔍
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