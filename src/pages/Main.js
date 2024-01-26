import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps'
import '../styles/Main.css';

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

    const [address, setAddress] = useState('');

    const [lat, setLat] = useState(37.3595704); //y
    const [lng, setLng] = useState(127.105399); //x
    const [storeName, setstoreName] = useState(''); //주소명

    const handleChange = (e) => {
        const newAddress = e.target.value
        setAddress(newAddress);
    }

    function searchAddress(){
        navermaps.Service.geocode(
            {
                query: address,
            },
            function (status, response) {
                if (status !== navermaps.Service.Status.OK) {
                    console.log('error');
                    return alert('주소를 찾을 수 없습니다.');
                }

                console.log('응답: ', response);
    
                const items = response.v2.addresses[0];
                console.log('아이템: ', items);

                let addressList = items.jibunAddress.split(' '); //지번 주소
                // console.log('주소 리스트: ', addressList);
    
                for (let i = 0; i < addressList.length; i++) {
                    if(!isNaN(+addressList[i])) break;
                    addressList.splice(i, 1);
                    i--;
                }
                for (let i = 0; i < addressList.length; i++) {
                    if(isNaN(+addressList[i])) break;
                    addressList.splice(i, 1);
                    i--;
                }

                setstoreName([...addressList].join(' ')); //주소명
                console.log('장소명: ', storeName);

                console.log('위도: ', items.y, '경도: ', items.x);
                setLng(items.x);
                setLat(items.y);
            }
        );
    }

    
    return (
        <MapDiv style={mapStyle}>
            <NaverMap 
                // defaultCenter={{ lat: 37.3595704, lng: 127.105399 }}
                center={{ lat: lat, lng: lng }} 
            >
                <Marker 
                    // defaultPosition={{ lat: 37.3595704, lng: 127.105399 }}
                    position={{ lat: lat, lng: lng }} 
                />
                <div className="contentWrap">
                    <div className="inputWrap">
                        <input 
                            style={inputStyle}
                            placeholder="지역이나 장소를 도로명 주소로 검색해 보세요" 
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