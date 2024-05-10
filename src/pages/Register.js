import React from 'react';
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios';

import { seoulAreas } from '../constants';
import { IoIosSearch } from "react-icons/io";
import CustomAlert from '../components/CustomAlert';
import CustomModal from '../components/CustomModal';
import StoreListModal from '../components/StoreListModal';
import '../styles/Register.css';


function Register() {
    const navigate = useNavigate();
    const location = useLocation();

    const request = location.state?.selectedStoreInfo || {};

    const [images, setImages] = useState([]);
    const [notAllow, setNotAllow] = useState(true);

    //검색 api를 위한 판매점 배열
    const [locations, setLocations] = useState([]);
    const [showStoreList, setShowStoreList] = useState(false);

    //모달 
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    //주소 검색 시 사용  
    const defaultDistrict = Object.keys(seoulAreas)[0];
    const defaultDong = seoulAreas[defaultDistrict][0];
    const [selectedCity, setSelectedCity] = useState('서울특별시');
    const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);
    const [selectedDong, setSelectedDong] = useState(defaultDong);

    //입력받은 판매점 정보
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [mapx, setMapx] = useState(0); //x
    const [mapy, setMapy] = useState(0); //y

    const handleDistrictSelect = (e) => {
        const selected = e.target.value;
        setSelectedDistrict(selected);
        setSelectedDong(null); // 동 선택 초기화
    };

    const handleDongSelect = (e) => {
        setSelectedDong(e.target.value);
    };

    const handleChange = (e) => {
        const newStore = e.target.value
        setTitle(newStore);
    }

    const handleModal =() => {
        // setShowModal(false);
        if (modalMessage === '로그인이 필요한 서비스입니다.') {
            navigate('/login');
        }        
        setModalMessage('');
    }

    const handleStoreListModal = (location) => {
        setShowStoreList(false);
        setTitle(location.title); 
        setAddress(location.address); 
        setMapx(location.mapx); 
        setMapy(location.mapy); 
    };

    const handleImageUpload = (e) => {
        const uploadImages = Array.from(e.target.files);
        const selectedImages = uploadImages.slice(0,3);
        setImages(selectedImages);
    }

    const searchStoreByName = () => {
        setStore('');
        if (selectedDistrict && selectedDong) {
            if (store.trim() !== '') {
                if (localStorage.getItem('token') === null) {
                    setModalMessage('로그인이 필요한 서비스입니다.');
                    setShowModal(true);
                } else {
                    axios
                        .get(
                            `http://3.37.245.108:8080/api/v1/stores/search?query=${encodeURIComponent(
                                selectedDistrict
                            )}${encodeURIComponent(selectedDong)}${encodeURIComponent(store)}`,
                            {
                                withCredentials: true,
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                                }
                            }
                        )
                        .then((res) => {
                            const items = res.data.result.items;
                            if (items.length === 0) {
                                setModalMessage('해당 판매점을 찾을 수 없습니다.');
                                setShowModal(true);
                                setShowLocationList(false);
                            } else {
                                setLocations(items);
                                setShowLocationList(true);
                                console.log(res.data.result.items);
                            }
                        })
                        .catch((err) => {
                            if (err.response.status === 401) {
                                refreshAccessToken()
                                    .then(() => {
                                        searchStoreByName();
                                    })
                            } else {
                                setModalMessage('해당 판매점을 찾을 수 없습니다.');
                                setShowModal(true);
                                console.log(err);
                            }
                        });
                }
            } else {
                setAlertMessage('검색어를 입력해주세요!');
                setShowAlert(true);
            }
        } else {
            setAlertMessage('행정구역을 선택해주세요!');
            setShowAlert(true);
        }
    };


    const registerLocation = () => {
        const formData = new FormData();

        const requestData = {
            title: title || request.title,
            mapx: mapx || request.mapx,
            mapy: mapy || request.mapy
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
            console.log('성공적으로 등록되었습니다!')
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

    const handleRegisterButtonClick = () => {
        registerLocation();
    }

    useEffect(() => {
        if ((Object.keys(request).length !== 0 && images.length !== 0) 
        || (title.length !== 0 && address.length !== 0 && mapx !== 0 && mapy !== 0 && images.length !== 0)) {
            setNotAllow(false);
            return;
        }
        setNotAllow(true);
    }, [title, address, mapx, mapy, images])

    return (
        <div className='chatPage'>
            <div className='titleWrap'>
                가게 위치는 여기에요 📢
            </div>

            <div className='registerContentWrap'>
                

                <div className="container" style={{ display: 'flex' }}>
                    <div className="infoTitle">가게명</div>
                    {showAlert && (
                        <div className="alertMsgWarpForRegister">
                            <CustomAlert message={alertMessage} />
                        </div>
                    )}
                </div>
                <div className='infoContent'>
                    {
                        Object.keys(request).length !== 0 ? request.title :
                        <input 
                            className='inputStyle'
                            placeholder="구역을 선택하고 판매점을 입력해주세요" 
                            value={title} 
                            onChange={handleChange}/>
                    }
                </div>

                {
                    showModal && (
                        <CustomModal 
                        message={modalMessage}
                        clickHandler={handleModal}/>
                    )
                }

                {
                    showStoreList && (
                        <StoreListModal
                        locations={locations}
                        clickHandler={handleStoreListModal}/>
                    )
                }

                <button className="searchButtonForRegister" onClick={searchStoreByName}><IoIosSearch/></button>

                <select
                    className='valueDropdown'
                    name='city'
                    id='city'
                    value={selectedCity}>
                    <option value=''>서울특별시</option>
                </select>

                {selectedCity && (
                    <select
                        className='valueDropdown'
                        name='district'
                        id='district'
                        onChange={handleDistrictSelect}
                        value={selectedDistrict}>
                        <option disabled value=''>구</option>
                        {Object.keys(seoulAreas).map((district, index) => (
                            <option key={index} value={district}>{district}</option>
                        ))}
                    </select>
                )}

                {selectedDistrict && (
                    <select
                        className='valueDropdown'
                        name='dong'
                        id='dong'
                        onChange={handleDongSelect}
                        value={selectedDong}>
                        <option disabled value=''>동</option>
                        {seoulAreas[selectedDistrict].map((dong, index) => (
                            <option key={index} value={dong}>{dong}</option>
                        ))}
                    </select>
                )}    

                <div className='infoTitle'>
                    가게 주소
                </div>
                <div className='infoAddress'>
                    {
                        Object.keys(request).length !== 0 ? request.address : address
                    }
                </div>

                
                <div className='infoTitle'>
                    가게 사진
                    <a>사진을 제보해주세요!</a>
                </div>
                <div className='imageContainer'>
                    <input className='imageInput' type="file" accept="image/*" multiple onChange={handleImageUpload} />
                </div>

                <button className='registerStoreButton' disabled={notAllow} onClick={handleRegisterButtonClick}>제보하기</button>
            </div>
        </div>
    )
}


export default Register;