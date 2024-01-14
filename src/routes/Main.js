import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps'
import '../static/Main.css';

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

    const [address, setAddress] = useState('');
    const [roadAddress, setRoadAddress] = useState(null);

    const [lat, setLat] = useState(37.3595704);
    const [lng, setLng] = useState(127.105399);

    const handleChange = (e) => {
        const newAddress = e.target.value
        setAddress(newAddress);
    }

    //주소를 입력하면 위도, 경도 찾기 함수 호출
    function searchAddress() {
        //입력받은 주소를 query로 전달
        navermaps.Service.geocode(
            {
                query: '보정동 694',
            },
            function(status, response) {
                //제대로 된 주소가 들어가지 않는 경우
                if (status !== navermaps.Service.Status.OK) {
                    return alert('주소를 찾을 수 없습니다.'); 
                    console.log(status)
                }
                var result = response.v2, //검색 결과 컨테이너
                    items = result.addresses; //검색 결과 배열
                
                setLat(parseFloat(items[0].y));
                setLng(parseFloat(items[0].x));
                setRoadAddress(items[0].roadAddress);
            }
        );
    }
    
    return (
        <MapDiv style={mapStyle}>
            <NaverMap defaultCenter={{ lat: lat, lng: lng }} defaultZoom={17} >
                <Marker position={{ lat: lat, lng: lng }} />
                <div className="contentWrap">
                    <div className="inputWrap">
                        <input 
                            style={inputStyle}
                            placeholder="지역이나 장소를 검색해 보세요" 
                            value={address} 
                            onChange={handleChange}/>
                    </div>

                    <button className="searchButton" 
                        onClick={(e) => {
                        e.preventDefault();
                        searchAddress();
                        setAddress('');
                    }}>🔍</button>
                </div>
            </NaverMap>
        </MapDiv>
    )
  }


export default Main;