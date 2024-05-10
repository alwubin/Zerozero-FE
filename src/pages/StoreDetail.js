import React, { useEffect, useState } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { refreshAccessToken } from '../authUtils';
import '../styles/StoreDetail.css';
import { zeroDrinks } from '../constants';

import { CiLocationOn } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { CiHashtag } from "react-icons/ci";


function StoreDetail() {
    const location = useLocation();
    const navigate = useNavigate();

    function getAndStoreStoreId() {
        const storeId = location.state ? location.state.storeId : 0;
        localStorage.setItem('storeId', storeId);
        return storeId;
    }
      
    function getStoredStoreId() {
        return localStorage.getItem('storeId');
    }
    const storeId = location.state ? getAndStoreStoreId() : getStoredStoreId();

    // const storeId = location.state ? location.state.storeId : 0;
    const storeName = location.state ? location.state.name : '';
    const storeCategory = location.state ? location.state.category : '';
    const storeRoadAddress = location.state ? location.state.roadAddress : '';
    const storeMapx = location.state ? location.state.mapx : 0;
    const storeMapy = location.state ? location.state.mapy : 0;

    // Store Info State
    const [Id, setId] = useState(0);
    const [name, setName] = useState('');
    const [roadAddress, setRoadAddress] = useState('');
    const [openningHours, setOpenningHours] = useState('10:30 - 22:00');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [images, setImages] = useState([]);
    const [mapx, setMapx] = useState(0);
    const [mapy, setMapy] = useState(0);
    
    //리뷰 정보
    const [content, setContent] = useState('');
    const [selectedZeroDrinks, setSelectedZeroDrinks] = useState([]);
    const [reviews, setReviews] = useState([]);
    

    const [top3ZeroDrinks, setTop3ZeroDrinks] = useState([]);

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

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setImages(files);
    };

    const inquireStoreDetail = () => {
        if (storeId > 0) {
            axios.get(`http://3.37.245.108:8080/api/v1/stores/${storeId}?sort=LATEST`, { 
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
            .then((res) => {
                const storeInfo = res.data.result.storeInfo;
                console.log(res.data.result);
                setId(storeInfo.storeId);
                setName(storeInfo.name);
                setRoadAddress(storeInfo.roadAddress);
                setCategory(storeInfo.category);

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
                if (err.response.status === 401) {
                    refreshAccessToken()
                        .then(() => {
                            inquireStoreDetail();
                        })
                } else {
                    console.log('장소 조회 실패: ', err);
                }
            });
        } else {
            setName(storeName);
            setCategory(storeCategory);
            setRoadAddress(storeRoadAddress);
            setMapx(storeMapx);
            setMapy(storeMapy);
            setIsLoading(false);
        }
    }

    const postReview = () => {
        const formData = {
            zeroDrinks: selectedZeroDrinks,
            content: content
        };

        axios.post(`http://3.37.245.108:8080/api/v1/reviews/${storeId}`,
            formData,
            { 
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                } 
            }
        )
        .then((res) => {
            console.log(res);
            alert('성공적으로 등록되었습니다!');
        })
        .catch((err) => {
            if (err.response.status === 401) {
                refreshAccessToken()
                    .then(() => {
                        postReview();
                    })
            } else {
                console.log('리뷰 등록 실패: ', err);
            }
        });
    }


    const registerLocation = () => {
        const formData = new FormData();

        const requestData = {
            title: name,
            mapx: mapx,
            mapy: mapy
        };

        formData.append('request', JSON.stringify(requestData));

        images.forEach((image, index) => {
            formData.append(`images`, image);
        });

        axios.post(`http://3.37.245.108:8080/api/v1/stores`, 
            formData,
            { 
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'multipart/form-data'
                } 
            }
        )
        .then((res) => {
            console.log(res);
            alert('성공적으로 등록되었습니다!');
            navigate('/');
        })
        .catch((err) => {
            if (err.response.status === 401) {
                refreshAccessToken()
                    .then(() => {
                        registerLocation();
                    })
            } else {
                console.log('장소 등록 실패: ', err);
            }
        });
    }

    useEffect(() => {
        inquireStoreDetail();
    }, []);

    const handleRegisterStore = () => {
        registerLocation();
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
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </div>
                            <button className='registerStoreDetailButton' onClick={handleRegisterStore}>등록하기</button>
                            <button className='cancelRegisterButton' onClick={() => {navigate('/')}}>취소</button>
                        </div>
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