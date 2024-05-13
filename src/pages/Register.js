import React from 'react';
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios';
import { refreshAccessToken } from '../authUtils';

import { seoulAreas,
    gangwonAreas,
    incheonAreas,
    gyeonggiAreas,
    chungbukAreas,
    chungnamAreas,
    daejeonAreas,
    sejongAreas,
    jeonnamAreas,
    jeonbukAreas,
    gwangjuAreas,
    gyeongnamAreas,
    gyeongbukAreas,
    busanAreas,
    daeguAreas,
    ulsanAreas,
    jejuAreas } from '../constants';
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
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    //입력받은 판매점 정보
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [mapx, setMapx] = useState(0); //x
    const [mapy, setMapy] = useState(0); //y

    const handleProvinceSelect = (e) => {
        setSelectedProvince(e.target.value);
        setSelectedCity('');
        setSelectedDistrict('');
    };

    const handleCitySelect = (e) => {
        setSelectedCity(e.target.value);
        setSelectedDistrict('');
    };

    const handleDistrictSelect = (e) => {
        setSelectedDistrict(e.target.value);
    };

    let cities = [];
    let districts = [];

    switch (selectedProvince) {
        case '서울특별시':
            cities = Object.keys(seoulAreas);
            districts = selectedCity ? seoulAreas[selectedCity] : [];
            break;
        case '강원도':
            cities = Object.keys(gangwonAreas);
            districts = selectedCity ? gangwonAreas[selectedCity] : [];
            break;
        case '인천광역시':
            cities = Object.keys(incheonAreas);
            districts = selectedCity ? incheonAreas[selectedCity] : [];
            break;
        case '경기도':
            cities = Object.keys(gyeonggiAreas);
            districts = selectedCity ? gyeonggiAreas[selectedCity] : [];
            break;
        case '충청북도':
            cities = Object.keys(chungbukAreas);
            districts = selectedCity ? chungbukAreas[selectedCity] : [];
            break;
        case '충청남도':
            cities = Object.keys(chungnamAreas);
            districts = selectedCity ? chungnamAreas[selectedCity] : [];
            break;
        case '대전광역시':
            cities = Object.keys(daejeonAreas);
            districts = selectedCity ? daejeonAreas[selectedCity] : [];
            break;
        case '세종특별자치시':
            cities = Object.keys(sejongAreas);
            districts = selectedCity ? sejongAreas[selectedCity] : [];
            break;
        case '전라남도':
            cities = Object.keys(jeonnamAreas);
            districts = selectedCity ? jeonnamAreas[selectedCity] : [];
            break;
        case '전라북도':
            cities = Object.keys(jeonbukAreas);
            districts = selectedCity ? jeonbukAreas[selectedCity] : [];
            break;
        case '광주광역시':
            cities = Object.keys(gwangjuAreas);
            districts = selectedCity ? gwangjuAreas[selectedCity] : [];
            break;
        case '경상남도':
            cities = Object.keys(gyeongnamAreas);
            districts = selectedCity ? gyeongnamAreas[selectedCity] : [];
            break;
        case '경상북도':
            cities = Object.keys(gyeongbukAreas);
            districts = selectedCity ? gyeongbukAreas[selectedCity] : [];
            break;
        case '부산광역시':
            cities = Object.keys(busanAreas);
            districts = selectedCity ? busanAreas[selectedCity] : [];
            break;
        case '대구광역시':
            cities = Object.keys(daeguAreas);
            districts = selectedCity ? daeguAreas[selectedCity] : [];
            break;
        case '울산광역시':
            cities = Object.keys(ulsanAreas);
            districts = selectedCity ? ulsanAreas[selectedCity] : [];
            break;
        case '제주특별자치도':
            cities = Object.keys(jejuAreas);
            districts = selectedCity ? jejuAreas[selectedCity] : [];
            break;
        default:
            break;
    }

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
        setTitle('');
        if (selectedProvince && selectedCity && selectedDistrict)  {
            if (title.trim() !== '') {
                if (localStorage.getItem('accessToken') === null) {
                    setModalMessage('로그인이 필요한 서비스입니다.');
                    setShowModal(true);
                } else {
                    axios
                        .get(
                            `http://3.37.245.108:8080/api/v1/stores/search?query=${encodeURIComponent(selectedProvince)}${encodeURIComponent(selectedCity)}${encodeURIComponent(selectedDistrict)}${encodeURIComponent(title)}`,
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
                            setShowStoreList(false);
                        } else {
                            setLocations(items);
                            setShowStoreList(true);
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
                    })
                }
            } else {
                setAlertMessage('검색어를 입력해주세요!');
                setShowAlert(true);
            }
        } else {
            setAlertMessage('행정구역을 선택해주세요!');
            setShowAlert(true);
        }
    }

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
                    name='province'
                    id='province'
                    onChange={handleProvinceSelect}
                    value={selectedProvince}>
                    <option value=''>시/도</option>
                    <option value='서울특별시'>서울특별시</option>
                    <option value='강원도'>강원도</option>
                    <option value='인천광역시'>인천광역시</option>
                    <option value='경기도'>경기도</option>
                    <option value='충청북도'>충청북도</option>
                    <option value='충청남도'>충청남도</option>
                    <option value='대전광역시'>대전광역시</option>
                    <option value='세종특별자치시'>세종특별자치시</option>
                    <option value='전라남도'>전라남도</option>
                    <option value='전라북도'>전라북도</option>
                    <option value='광주광역시'>광주광역시</option>
                    <option value='경상남도'>경상남도</option>
                    <option value='경상북도'>경상북도</option>
                    <option value='부산광역시'>부산광역시</option>
                    <option value='대구광역시'>대구광역시</option>
                    <option value='울산광역시'>울산광역시</option>
                    <option value='제주특별자치도'>제주특별자치도</option>
                </select>

                <select
                    className='valueDropdown'
                    name='city'
                    id='city'
                    onChange={handleCitySelect}
                    value={selectedCity}>
                    <option disabled value=''>시/군/구</option>
                    {cities.map((city, index) => (
                        <option key={index} value={city}>{city}</option>
                    ))}
                </select>


                <select
                    className='valueDropdown'
                    name='district'
                    id='district'
                    onChange={handleDistrictSelect}
                    value={selectedDistrict}>
                    <option disabled value=''>동/면/읍</option>
                    {districts.map((district, index) => (
                        <option key={index} value={district}>{district}</option>
                    ))}
                </select>  

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