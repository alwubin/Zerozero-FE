import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import '../styles/StoreDetail.css';
import { zeroDrinks } from '../constants';

import { CiLocationOn } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { CiHashtag } from "react-icons/ci";


function StoreDetail() {

    return (
        <div className='storeDetail'>
            <div className='scrollInfo'>
                <div className='basicInfoTop'>
                    <div className='storeDetailImageWrap'>
                        <img src={'images/default_store.jpeg'} className='storeDetailImage' />
                    </div>
                    <div className='storeDetailTitleWrap'>
                        스타벅스 구성트레이더스점
                    </div>
                    <div className='storeDetailContainer'>
                        상세정보
                        <div className='storeDetailAddress'>
                            <CiLocationOn/>
                        </div>
                        <div className='storeDetailContent'>
                            <CiClock2/>
                        </div>
                        <div className='storeDetailCategory'>
                            <CiHashtag/>
                        </div>
                    </div>
                </div>
                <div className='reviewInputBox'>
                    리뷰 작성
                    <a>리뷰를 남겨보세요!</a>
                    <form className='reviewForm'>
                        <a className='reviewQuestion'>판매중인 제로 음료수 종류를 모두 선택해주세요!</a>
                        <div className='radioButtonWrap'>
                        {Object.entries(zeroDrinks).map(([key, value], index) => (
                            <div key={index} className="radioButton">
                                <input type="checkbox" id={`drink-${index}`} value={key} />
                                <label htmlFor={`drink-${index}`}>{value}</label>
                            </div>
                        ))}
                        </div>
                        <input className='reviewInput' type='text' placeholder='이 장소의 후기를 남겨주세요.'/>
                    </form>
                </div>
                <div className='reviewList'>
                    <div className='reviewListTitle'>
                        리뷰 목록
                        <a>남겨진 리뷰를 확인하세요!</a>
                    </div>
                    <div className='reviewListWrap'>
                        <div className='zeroDrinkRankWrap'>
                            <div className="zeroDrinkRank">
                                <div className='rankWrapper'>
                                    <div className='rankIconWrap'>
                                        <img className="rankIcon" src="images/zeroDrinks/COCA_COLA_ZERO.png" alt="코카콜라 제로" />
                                    </div>
                                    <div className='rank2'>2</div>
                                </div>
                                <div className='rankWrapper'>
                                    <div className='rankIconWrap'>
                                        <img className="rankIcon" src="images/zeroDrinks/COCA_COLA_ZERO.png" alt="코카콜라 제로" />
                                    </div>
                                    <div className='rank1'>1</div>
                                </div>
                                <div className='rankWrapper'>
                                    <div className='rankIconWrap'>
                                        <img className="rankIcon" src="images/zeroDrinks/COCA_COLA_ZERO.png" alt="코카콜라 제로" />
                                    </div>
                                    <div className='rank3'>3</div>
                                </div>
                            </div>
                        </div>
                        <div className='reviewListContent'>
                            <div class="review">
                                <div class="review-header">
                                    <span class="nickname">나서호빵</span>
                                    <div class="zero-drink-icons">
                                        <span class="zero-drink-icon">
                                            <img src="images/zeroDrinks/COCA_COLA_ZERO.png" alt="코카콜라 제로" />
                                        </span>
                                    </div>
                                </div>
                                <div class="review-content">맛있어요</div>
                                <hr />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StoreDetail;