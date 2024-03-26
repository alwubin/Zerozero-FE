import React, { useEffect, useState } from 'react'; 
import '../styles/StoreDetail.css';
import axios from 'axios';

function StoreDetail() {

    return (
        <div className='storeDetail'>
            <div className='basicInfoTop'>
                <div className='registeredStoreImage'>
                    {/* <img src={require('../images/storeDetail.png')} alt='storeDetail' /> */}
                    등록 시 업로드 된 가장 첫 번째 사진
                </div>
                <div className='storeDetailTitleWrap'>
                    스타벅스 구성트레이더스점
                </div>
                <div className='storeDetailContainer'>
                    상세정보
                    <div className='storeDetailAddress'>
                        주소
                    </div>
                    <div className='storeDetailContent'>
                        금일 영업 시간
                    </div>
                    <div className='storeDetailCategory'>
                        카테고리
                    </div>
                </div>
            </div>
            <div className='reviewInputBox'>
                리뷰 작성
            </div>
            <div className='reviewList'>
                리뷰 목록
            </div>
        </div>
    )
}

export default StoreDetail;