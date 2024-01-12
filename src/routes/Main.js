import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/Main.css";
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps'

const searchBox = {
    zIndex: 2000,
}

const inputStyle = {
    // width: '70%',
    // height: '90px',
    // position: 'relative',
    // margin: '20px 0 20px 40px',
    paddingLeft: '20px',
    position: 'absolute',
    top: '5%',
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: '70%',
    height: '90px',
    borderRadius: '15px',
    border: '1px solid grey',
    fontSize: '20px',
    backgroundColor: 'white',
}

const buttonStyle = {
    WebkitAppearance: 'button',
    cursor: 'pointer',
    padding: '0px',
    WebkitBorderRadius: '5px',
    border: 'none',
    outline: '0 none',
    width: '10%',
    height: '10%',
    backgroundColor: 'transparent',
    fontSize: '40px',
    position: 'absolute',
    top: '50px',
    right: '190px',
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
        <MapDiv style={{ width: '100%', height: '740px' }}>
            <NaverMap defaultCenter={{ lat: lat, lng: lng }} defaultZoom={17} >
                <Marker position={{ lat: lat, lng: lng }} />
                <div style={searchBox}>
                    <form>
                        <input style={inputStyle} placeholder="지역이나 장소를 검색해 보세요" value={address} onChange={handleChange}/>
                        <button style={buttonStyle} onClick={(e) => {
                            e.preventDefault();
                            searchAddress();
                            setAddress('');
                        }}>🔍</button>
                    </form>
                </div>
            </NaverMap>
        </MapDiv>
    )
  }


export default Main;