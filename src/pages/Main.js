import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps'
import { IoIosSearch } from "react-icons/io";
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
    const [roadAddress, setRoadAddress] = useState('');

    const [lat, setLat] = useState(37.3595704); //y
    const [lng, setLng] = useState(127.105399); //x
    const [storeName, setstoreName] = useState(''); //주소명

    const handleChange = (e) => {
        const newAddress = e.target.value
        setAddress(newAddress);
    }

    var contentString = [
        `<div class="contentWrap">`,
        `   <h3>${storeName}</h3>`,
        `   <p>도로명 주소: ${roadAddress}<br />`,
        `       등록한 사용자: 호빵이는제로칼로리`,
        `   </p>`,
        `</div>`
    ].join(``);

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

                const roadAddress = items.roadAddress;
                setRoadAddress(roadAddress);

                var regex = /[0-9]/; 
                var index = roadAddress.search(regex); 

                //장소명 동기적으로 처리하는 callback 함수
                setstoreName((prevStoreName) => {
                    const newStoreName = roadAddress.substring(index + 2, roadAddress.length).trim();
                    console.log('장소명: ', newStoreName);
                    return newStoreName;
                });

                console.log('위도: ', items.y, '경도: ', items.x);
                setLng(items.x);
                setLat(items.y);
            }
        );
    }

    
    return (
        <MapDiv style={mapStyle}>
            <NaverMap center={{ lat: lat, lng: lng }} >
                <Marker 
                    position={{ lat: lat, lng: lng }} 
                    onClick={() => {alert(`여기는 입니다.`)}}
                >
                    {/* <InfoWindow
                        content={contentString}
                    /> */}
                    {/* <Listener 
                        type="click" 
                        listener={() => window.alert(`${storeName} 클릭됨`)} />
                         */}
                </Marker>
                
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
                    }}><IoIosSearch/></button>
                </div>
            </NaverMap>
        </MapDiv>
    )
  }


export default Main;