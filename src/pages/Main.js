import { Container as MapDiv, NaverMap, Marker, useNavermaps, InfoWindow } from 'react-naver-maps'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

import  CustomAlert from '../components/CustomAlert';
import CustomModal from '../components/CustomModal';
import { seoulAreas } from '../constants';
import { IoIosSearch } from "react-icons/io";
import '../styles/Main.css';

/** CHECKLIST
 * [ ] CustomAlertNotice 창 비로그인 상태 출력 오류 및 메인 페이지에 기본 렌더링 시 빈칸으로 최상단 출력되는 오류 수정 필요
 * [ ] 로그인 시간 만료 후 팝업 보여주고 자동 로그아웃
 * [X] (기본값) 현재 위치 기반 지도 출력되로록 하기
 * [ ] Marker 클릭 시 지역 내로 줌 인 되도록 하기
 * [ ] Marker 클릭 시 해당 장소에 대한 정보 출력 스타일 변경
 * [X] 장소 검색 시 OO구 OO동 필수 선택 후 검색 
 */


const mapStyle = {
    position: 'absolute',
    top: '0',
    bottom: '0',
    width: '100%',
    maxWidth: '500px',
    padding: '0 20px',
    left: '50%',
    transform: 'translate(-50%, 0)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
}

const inputStyle = {
    width: '100%',
    outline: 'none',
    border: 'none',
    height: '20px',
    fontSize: '14px',
    fontWeight: '400',
}


function Main() {
    const navermaps = useNavermaps();
    const navigate = useNavigate();
    
    const [map, setMap] = useState(null);
    const [infoWindow, setInfoWindow] = useState(null);

    //검색 api를 위한 판매점 배열
    const [store, setStore] = useState(''); 
    const [locations, setLocations] = useState([]);

    //서울시 00구 00동 행정구역 
    const defaultDistrict = Object.keys(seoulAreas)[0];
    const defaultDong = seoulAreas[defaultDistrict][0];

    const [lat, setLat] = useState(37.5690700); //y
    const [lng, setLng] = useState(127.0237322); //x
    const [zoom, setZoom] = useState(11);

    const [selectedCity, setSelectedCity] = useState('서울특별시');
    const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);
    const [selectedDong, setSelectedDong] = useState(defaultDong);

    //alert 모달 
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const newStore = e.target.value
        setStore(newStore);
    }

    useEffect(() => {
        navermaps.Service.geocode(
            {
                query: `${selectedCity} ${selectedDistrict} ${selectedDong}`,
            },
            function (status, response) {
                if (status === navermaps.Service.Status.ERROR) {
                    return alert('지오코딩 실패');
                }
                const addresses = response.v2.addresses;
                if (addresses.length > 0) {
                    const items = addresses[0];
                    console.log('위도: ', items.y, '경도: ', items.x);
                    setLng(items.x);
                    setLat(items.y);
                    setZoom(13);
                } else {
                    // 검색 결과가 없는 경우에 대한 처리
                    console.log('검색 결과가 없습니다.');
                }
            }
        );
    }, [selectedCity, selectedDistrict, selectedDong]); // 검색 조건이 변경될 때마다 실행

    const handleDistrictSelect = (e) => {
        const selected = e.target.value;
        setSelectedDistrict(selected);
        setSelectedDong(null); // 동 선택 초기화
    };

    const handleDongSelect = (e) => {
        setSelectedDong(e.target.value);
    };

    // const logoutUser = () => {
    //     localStorage.removeItem('token');
    //     window.location.href = '/';
    // }

    const handleModal =() => {
        setShowModal(false);
        if (modalMessage === '로그인이 필요한 서비스입니다.') {
            navigate('/login');
        }        
        setModalMessage('');
    }

    const searchStoreByName = () => {
        setStore('');
        if (selectedDistrict && selectedDong) {
            if (store.trim() !== '') {
                if (localStorage.getItem('token') === null) {
                    setModalMessage('로그인이 필요한 서비스입니다.');
                    setShowModal(true);
                }
                else {
                    axios.get(`http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/stores/search?query=${encodeURIComponent(selectedDistrict)}${encodeURIComponent(selectedDong)}${encodeURIComponent(store)}`, { 
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        } 
                    })
                    .then((res) => {
                        const items = res.data.result.items;
                        setLocations(items);
                        console.log(res.data.result.items);
                    })
                    .catch((err) => {
                        setModalMessage('해당 판매점을 찾을 수 없습니다.');
                        setShowModal(true);
                        console.log(err);
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

    // useEffect(() => {
    //     setAlertMessage('');
    //     setShowAlert(false);
    // }, []);

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         setShowAlert(false);
    //         setAlertMessage('');
    //     }, 2000);
    //     return () => clearTimeout(timeout);
    // }, [showAlert]);

    useEffect(() => {
        locations.map((location) => {
            console.log(location);
        });
    }, [locations]);
    
    return (
        <MapDiv style={mapStyle}>
            <NaverMap 
                center={{ lat: lat, lng: lng }} 
                zoom={zoom}
                ref={(ref) => setMap(ref)}
            >
                {locations.map((location, idx) => {
                    return (
                        <Marker
                            key={idx}
                            position={new navermaps.LatLng((location.mapy)*0.0000001, (location.mapx)*0.0000001)}
                            icon={{
                                url: '/images/noZeroMarker.png',
                                scaledSize: new navermaps.Size(35, 47.5),
                                origin: new navermaps.Point(0, 0),
                            }}
                            onClick={(e) => {
                                const content = [
                                    `<div class="iw_inner">`,
                                    `   <h4 class="shop_title">${location.title}</h3>`,
                                    `   <p class="addresses">${location.roadAddress} <br>`,
                                    `       ${location.address}<br>`,
                                    `       ${location.category}<br>`,
                                    `   </p>`,
                                    `</div>`
                                ].join('');

                                if (infoWindow.getMap()) {
                                    infoWindow.close();
                                } else {
                                    infoWindow.setContent(content);
                                    infoWindow.open(map, e.overlay);
                                }
                            }}
                        />
                    );
                })}
                <InfoWindow ref={(ref) => setInfoWindow(ref)} />

                <div className="contentWrap">
                    <div>
                        {
                            showAlert && (
                                <div className='alertMsgWrap'>
                                    <CustomAlert 
                                    message={alertMessage}/>
                                </div>
                            )
                        }
                        <div className="inputWrap">
                            <input 
                                style={inputStyle}
                                placeholder="판매점을 검색해 보세요" 
                                value={store} 
                                onChange={handleChange}/>
                        </div>
                    </div>
                    {
                        showModal && (
                            <CustomModal 
                            message={modalMessage}
                            clickHandler={handleModal}/>
                        )
                    }

                    <button className="searchButton" onClick={searchStoreByName}><IoIosSearch/></button>

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
                </div>
            </NaverMap>
        </MapDiv>
    )
}



export default Main;