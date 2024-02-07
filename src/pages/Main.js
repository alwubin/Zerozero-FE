import { Container as MapDiv, NaverMap, Marker, useNavermaps, Listener } from 'react-naver-maps'
import { useState, useEffect } from 'react'
import axios from 'axios';

import { IoIosSearch } from "react-icons/io";
import '../styles/Main.css';

/** CHECKLIST
 * [ ] 비로그인 상태에서 검색 시 로그인이 필요하다는 alert 후 로그인 페이지로 이동
 * [ ] (기본값) 현재 위치 기반 지도 출력되로록 하기
 * [ ] Marker 클릭 시 지역 내로 줌 인 되도록 하기
 * [ ] Marker 클릭 시 해당 장소에 대한 정보 출력
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

// function Main() {
//     const navermaps = useNavermaps();

//     const [address, setAddress] = useState('');
//     const [roadAddress, setRoadAddress] = useState('');

//     const [lat, setLat] = useState(37.3595704); //y
//     const [lng, setLng] = useState(127.105399); //x
//     const [store, setStore] = useState(''); //가게명

//     //검색 api를 위한 판매점 배열
//     const [storeArray, setStoreArray] = useState([]);

//     const handleChange = (e) => {
//         const newStore = e.target.value
//         setStore(newStore);
//     }

//     // var contentString = [
//     //     `<div class="contentWrap">`,
//     //     `   <h3>${storeName}</h3>`,
//     //     `   <p>도로명 주소: ${roadAddress}<br />`,
//     //     `       등록한 사용자: 호빵이는제로칼로리`,
//     //     `   </p>`,
//     //     `</div>`
//     // ].join(``);

//     const searchStoreByName = () => {
//         axios.get(`http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/stores/search?query=${encodeURIComponent(store)}`, { 
//             withCredentials: true,
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('token')}`
//             } 
//         })
//         .then((res) => {
//             const storeArray = res.data.result.items;
//             setStoreArray(storeArray);
//             console.log(res.data.result.items);
//             console.log('storeArray:', storeArray);
//         })
//         .catch(() => {
//             console.log('해당 판매점을 찾을 수 없습니다.');
//         })

//     }

//     // function searchAddress(){
//     //     navermaps.Service.geocode(
//     //         {
//     //             query: address,
//     //         },
//     //         function (status, response) {
//     //             if (status !== navermaps.Service.Status.OK) {
//     //                 console.log('error');
//     //                 return alert('주소를 찾을 수 없습니다.');
//     //             }

//     //             console.log('응답: ', response);
    
//     //             const items = response.v2.addresses[0];
//     //             console.log('아이템: ', items);

//     //             const roadAddress = items.roadAddress;
//     //             setRoadAddress(roadAddress);

//     //             var regex = /[0-9]/; 
//     //             var index = roadAddress.search(regex); 

//     //             //장소명 동기적으로 처리하는 callback 함수
//     //             setstoreName((prevStoreName) => {
//     //                 const newStoreName = roadAddress.substring(index + 2, roadAddress.length).trim();
//     //                 console.log('장소명: ', newStoreName);
//     //                 return newStoreName;
//     //             });

//     //             console.log('위도: ', items.y, '경도: ', items.x);
//     //             setLng(items.x);
//     //             setLat(items.y);
//     //         }
//     //     );
//     // }

    
//     return (
//         <MapDiv style={mapStyle}>
//             <NaverMap center={{ lat: lat, lng: lng }} >
//                 <Marker 
//                     position={{ lat: lat, lng: lng }} 
//                     onClick={() => {alert(`여기는 입니다.`)}}
//                 >
//                 </Marker>
                
//                 <div className="contentWrap">
//                     <div className="inputWrap">
//                         <input 
//                             style={inputStyle}
//                             placeholder="판매점을 검색해 보세요" 
//                             value={store} 
//                             onChange={handleChange}/>
//                     </div>

//                     <button className="searchButton" 
//                         onClick={searchStoreByName
//                             // (e) => {
//                             // e.preventDefault();
//                             // searchAddress();
//                             // setAddress('');
//                             // }
//                     }><IoIosSearch/></button>
//                 </div>
//             </NaverMap>

//         </MapDiv>
//     )
//   }


function Main() {
    const navermaps = useNavermaps();
    
    //검색 api를 위한 판매점 배열
    const [store, setStore] = useState(''); 
    const [locations, setLocations] = useState([]);

    const handleChange = (e) => {
        const newStore = e.target.value
        setStore(newStore);
    }

    const searchStoreByName = () => {
        axios.get(`http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/stores/search?query=${encodeURIComponent(store)}`, { 
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
        .catch(() => {
            console.log('해당 판매점을 찾을 수 없습니다.');
        })

    }

    useEffect(() => {
        locations.map((location) => {
            console.log(location);
        })
    }, [locations]);
    
    return (
        <MapDiv style={mapStyle}>
            <NaverMap 
                center={new navermaps.LatLng(37.5690700, 127.0237322)}
                zoom={11}
            >
                {locations.map((location, idx) => {
                    return (
                        <Marker
                            key={idx}
                            position={new navermaps.LatLng((location.mapy)*0.0000001, (location.mapx)*0.0000001)}
                            onClick={() => { console.log(location.title) }}
                        >
                            {/* <Listener target={lo} type='click' listener={() => {console.log('click') }} /> */}
                        </Marker>
                    );
                })}
                
                <div className="contentWrap">
                    <div className="inputWrap">
                        <input 
                            style={inputStyle}
                            placeholder="판매점을 검색해 보세요" 
                            value={store} 
                            onChange={handleChange}/>
                    </div>

                    <button className="searchButton" 
                        onClick={searchStoreByName}><IoIosSearch/></button>
                </div>
            </NaverMap>
        </MapDiv>
    )
}

export default Main;