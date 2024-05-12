import { Container as MapDiv, NaverMap, Marker, useNavermaps, InfoWindow } from 'react-naver-maps'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { refreshAccessToken } from '../authUtils';

import CustomAlert from '../components/CustomAlert';
import CustomModal from '../components/CustomModal';
import LocationList from '../components/LocationList';
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
import '../styles/Main.css';

/** CHECKLIST
 * [X] CustomAlertNotice 창 비로그인 상태 출력 오류 및 메인 페이지에 기본 렌더링 시 빈칸으로 최상단 출력되는 오류 수정 필요
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
    maxWidth: '540px',
    // padding: '0 20px',
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
    // const [infoWindow, setInfoWindow] = useState(null);

    //검색 api를 위한 판매점 배열
    const [store, setStore] = useState(''); 
    const [locations, setLocations] = useState([]);
    const [showLocationList, setShowLocationList] = useState(false);

    const [lat, setLat] = useState(37.5690700); //y
    const [lng, setLng] = useState(127.0237322); //x
    const [zoom, setZoom] = useState(11);
    const [markers, setMarkers] = useState(locations.map((location, idx) => ({
        position: new navermaps.LatLng((location.mapy)*0.0000001, (location.mapx)*0.0000001),
        icon: '/images/yesZeroMarker.png',
        scaledSize: new navermaps.Size(35, 47.5),
        origin: new navermaps.Point(0, 0),
    })));

    const [selectedMarkerIdx, setSelectedMarkerIdx] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedStoreInfo, setSelectedStoreInfo] = useState({
        title: '',
        mapx: '',
        mapy: ''
    });

    //alert 모달 
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isSelling, setIsSelling] = useState(false);

    const handleChange = (e) => {
        const newStore = e.target.value
        setStore(newStore);
    }

    const handleMarkerClick = (idx) => {
        setSelectedMarkerIdx(idx);

        //클릭된 판매점 정보
        const clickedLocationInfo = locations[idx];
        console.log(clickedLocationInfo);
        const { title, mapx, mapy, roadAddress, selling } = clickedLocationInfo;

        setSelectedStoreInfo({
            title: title,
            mapx: mapx,
            mapy: mapy, 
            address: roadAddress,
            selling: selling,
        })
        setIsSelling(selling);
        console.log(selectedStoreInfo);
        console.log(isSelling);

        const locationList = document.querySelector('.locationCarousel');
        const locationWrapper = locationList.querySelector('.locationWrapper');
        const locationWrapperWidth = locationWrapper.offsetWidth;
        const scrollAmount = locationWrapperWidth * (idx - 1); // 선택된 마커의 인덱스로부터 앞의 마커들의 너비만큼 이동
    
        locationList.scrollTo({
            left: scrollAmount,
            behavior: 'smooth' 
        });
    }

    useEffect(() => {
        console.log(selectedStoreInfo); // 변경된 selectedStoreInfo 확인
    }, [selectedStoreInfo]);

    useEffect(() => {
        navermaps.Service.geocode(
            {
                query: `${selectedProvince} ${selectedCity} ${selectedDistrict}`,
            },
            function (status, response) {
                if (status === navermaps.Service.Status.ERROR) {
                    return alert('지오코딩 실패');
                }
                const addresses = response.v2.addresses;
                if (!addresses || addresses.length === 0) { // addresses가 undefined이거나 길이가 0인 경우 처리
                    // 검색 결과가 없는 경우에 대한 처리
                    console.log('검색 결과가 없습니다.');
                } else {
                    const items = addresses[0];
                    console.log('위도: ', items.y, '경도: ', items.x);
                    setLng(items.x);
                    setLat(items.y);
                    setZoom(13);
                }
            }
        );
    }, [selectedProvince, selectedCity, selectedDistrict]); // 검색 조건이 변경될 때마다 실행

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

    const handleModal = () => {
        setShowModal(false);
        if (modalMessage === '로그인이 필요한 서비스입니다.') {
            navigate('/login');
        }        
        setModalMessage('');
    }

    const handleRegisterLocation = () => {
        navigate('/register', { state: { selectedStoreInfo } });
    }

    const searchStoreByName = () => {
        setStore('');
        if (selectedProvince && selectedCity && selectedDistrict) {
            if (store.trim() !== '') {
                if (localStorage.getItem('accessToken') === null) {
                    setModalMessage('로그인이 필요한 서비스입니다.');
                    setShowModal(true);
                } else {
                    axios
                        .get(
                            `http://3.37.245.108:8080/api/v1/stores/search?query=${encodeURIComponent(selectedProvince)}${encodeURIComponent(selectedCity)}${encodeURIComponent(selectedDistrict)}${encodeURIComponent(store)}`,
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

    useEffect(() => {
        setMarkers(locations.map((location, idx) => ({
            position: new navermaps.LatLng((location.mapy)*0.0000001, (location.mapx)*0.0000001),
            icon: (location.selling ? '/images/yesZeroMarker.png' : '/images/noZeroMarker.png'),
            scaledSize: new navermaps.Size(35, 47.5),
            origin: new navermaps.Point(0, 0),
        })));
    }, [locations]);
    
    return (
        <MapDiv style={mapStyle}>
            <NaverMap 
                center={{ lat: lat, lng: lng }} 
                zoom={zoom}
                ref={(ref) => setMap(ref)}
                >
                
                {
                    markers.map((marker, idx) => (
                        <Marker
                            key={idx}
                            position={marker.position}
                            icon={{
                                url: selectedMarkerIdx === idx ? (marker.icon === '/images/yesZeroMarker.png' ? '/images/clickedYesZeroMarker.png' : '/images/clickedNoZeroMarker.png') : marker.icon,
                                scaledSize: marker.scaledSize,
                                origin: marker.origin,
                            }}
                            onClick={() => handleMarkerClick(idx)}
                        />
                    ))
                }
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

                </div>

                {
                    showLocationList && 
                    <LocationList 
                        locations={locations} 
                        selectedMarkerIdx={selectedMarkerIdx}
                        isSelling={isSelling}
                        registerLocation={handleRegisterLocation}
                    />
                }
            </NaverMap>
        </MapDiv>
    )
}



export default Main;