import React, { useEffect, useState } from 'react'; 
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/StoreDetail.css';
import { zeroDrinks } from '../constants';

import { CiLocationOn } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { CiHashtag } from "react-icons/ci";


function StoreDetail() {
    const location = useLocation();
    const storeId = location.state.storeId;
    const storeName = location.state.name;
    const storeCategory = location.state.category;
    const storeRoadAddress = location.state.roadAddress;

    //storeInfo
    const [Id, setId] = useState(0);
    const [name, setName] = useState('');
    const [roadAddress, setRoadAddress] = useState('');
    const [openningHours, setOpenningHours] = useState('10:30 - 22:00');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    //reviews
    const [content, setContent] = useState('');
    const [selectedZeroDrinks, setSelectedZeroDrinks] = useState([]);
    const [reviews, setReviews] = useState([]);
    
    //top3
    const [top3ZeroDrinks, setTop3ZeroDrinks] = useState([]);
    
    const inquireStoreDetail = () => {
        if (storeId > 0) {
            axios.get(`http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/stores/${storeId}?sort=LATEST`, { 
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }})
            .then((res) => {
                const storeInfo = res.data.result.storeInfo;
                setId(storeId);
                setName(storeInfo.name);
                setRoadAddress(storeInfo.roadAddress);
                setCategory(storeInfo.category);
                console.log(`Id: ${Id}`)
                console.log(`storeId: ${storeId}`)
                const images = storeInfo.images;
                if (images && images.length > 0) {
                    setImage(images[0]); 
                } else {
                    setImage(''); 
                }
                const reviews = res.data.result.reviews;
                setReviews(reviews);

                const top3 = res.data.result.top3ZeroDrinks;
                setTop3ZeroDrinks(top3);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);

            })
        } 
        else {
            setName(storeName);
            setCategory(storeCategory);
            setRoadAddress(storeRoadAddress);
            setIsLoading(false);
        }
    }

    const postReview = () => {
        if (Id > 0) { // Id가 0보다 큰 경우에만 실행
            const formData = {
                zeroDrinks: selectedZeroDrinks,
                content: content
            };
    
            axios.post(`http://ec2-3-35-98-32.ap-northeast-2.storescompute.amazonaws.com:8080/api/v1/reviews/${Id}`,
            formData,
            { 
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                } 
            })
            .then((res) => {
                console.log(res);
                alert('성공적으로 등록되었습니다!');
            })
            .catch((err) => {
                console.log(err);
            })
        } else {
            console.error('Id가 유효하지 않습니다.');
        }
    }
    

    useEffect(() => {
        inquireStoreDetail();
    }, [storeId, Id]);


    const handleRegisterStore = () => {
        alert('등록되었습니다!');
    };


    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setSelectedZeroDrinks([...selectedZeroDrinks, value]);
        } else {
            setSelectedZeroDrinks(selectedZeroDrinks.filter((drink) => drink !== value));
        }
    };

    const handleInputChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <div className='storeDetail'>
            <div className='scrollInfo'>
                <div className='basicInfoTop'>
                    <div className='storeDetailImageWrap'>
                        {image ? (
                            <img src={image} alt="Store Image" className='storeDetailImage' />
                        ) : (
                            <div className='storeDetailImageDefault'></div>
                        )}
                    </div>
                    <div className='storeDetailTitleWrap'>
                        {name}
                    </div>
                    <div className='storeDetailContainer'>
                        <div className='storeDetailInfoTitle'>
                            상세정보
                        </div>
                        <div className='storeDetailInfoWrap'>
                            <CiLocationOn />
                            {roadAddress}
                        </div>
                        <div className='storeDetailInfoWrap'>
                            <CiClock2/>
                            {openningHours}
                        </div>
                        <div className='storeDetailInfoWrap'>
                            <CiHashtag/>
                            {category}
                        </div>
                    </div>
                </div>

                {storeId === 0 ? (
                    <div>
                        <div className='imageInputContainer'>
                            가게 사진
                            <a>사진을 제보해주세요!</a>
                            <div className='imageContainer'>
                            <input
                                className='imageInput'
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={() => {
                                console.log(1);
                                }}
                            />
                            </div>
                        </div>
                        <button className='registerStoreDetailButton' onClick={handleRegisterStore}> 등록하기</button>
                        <button className='cancelRegisterButton'>취소</button>
                    </div>
                    ) : (
                    <div>
                        <div className='reviewInputContainer'>
                            리뷰 작성
                            <a>리뷰를 남겨보세요!</a>
                            <form className='reviewForm'>
                            <div className='reviewQuestion'><span>판매중인 제로 음료수 종류를 모두 선택해주세요!</span></div>
                                <div className='radioButtonWrap'>
                                {Object.entries(zeroDrinks).map(([key, value], index) => (
                                    <div key={index} className="radioButton">
                                    <input
                                        type="checkbox"
                                        id={`drink-${index}`}
                                        value={value}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label htmlFor={`drink-${index}`}>{key}</label>
                                    </div>
                                ))}
                                </div>
                                <input
                                    className='reviewInput'
                                    type='text'
                                    placeholder='이 장소의 후기를 남겨주세요.'
                                    value={content}
                                    onChange={handleInputChange}
                                />
                                <button className='reviewSubmitButton' onClick={postReview}>올리기</button>
                            </form>
                        </div>
                        <div className='reviewListContainer'>
                            <div className='reviewListTitle'>
                                리뷰 목록
                                <a>남겨진 리뷰를 확인하세요!</a>
                            </div>
                            <div className='reviewListWrap'>
                                <div className='zeroDrinkRankWrap'>
                                    <div className="zeroDrinkRank">
                                        <div className='rankWrapper'>
                                            <div className='rankIconWrap'>
                                                {
                                                    top3ZeroDrinks[1] 
                                                    ? <img className="rankIcon" src={`images/zeroDrinks/${top3ZeroDrinks[1]}.png`} alt="2등" />
                                                    : <div>?</div>
                                                }
                                            </div>
                                            <div className='rank2'>2</div>
                                        </div>
                                        <div className='rankWrapper'>
                                            <div className='rankIconWrap'>
                                                {
                                                    top3ZeroDrinks[0] 
                                                    ? <img className="rankIcon" src={`images/zeroDrinks/${top3ZeroDrinks[0]}.png`} alt="2등" />
                                                    : <div>?</div>
                                                }
                                            </div>
                                            <div className='rank1'>1</div>
                                        </div>
                                        <div className='rankWrapper'>
                                            <div className='rankIconWrap'>
                                                {
                                                    top3ZeroDrinks[2] 
                                                    ? <img className="rankIcon" src={`images/zeroDrinks/${top3ZeroDrinks[2]}.png`} alt="2등" />
                                                    : <div>?</div>
                                                }
                                            </div>
                                            <div className='rank3'>3</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='reviewListContent'>
                                    {reviews.length === 0 ? (
                                        <div className='noReivewWrap'>등록된 리뷰가 없습니다.</div>
                                    ) : (
                                        reviews.map((review, idx) => (
                                            <React.Fragment key={idx}>
                                                <div className="review">
                                                    <div className="review-header">
                                                        <span className="nickname">{review.nickname}</span>
                                                        <div className="zero-drink-icons">
                                                            {review.zeroDrinks.map((drink, index) => (
                                                                <span key={index} className="zero-drink-icon">
                                                                    <img
                                                                        src={`images/zeroDrinks/${drink}.png`}
                                                                        alt={drink}
                                                                    />
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="review-content">{review.content}</div>
                                                </div>
                                                {idx !== reviews.length - 1 && <hr />}
                                            </React.Fragment>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>)
                    }                   
            </div>
        </div>
    )
}

export default StoreDetail;