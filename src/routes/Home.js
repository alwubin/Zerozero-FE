import { useEffect, useRef } from "react";

const Home = () => {
    let mapElement = useRef(null);
    let { naver } = window;

    useEffect(() => {
        initMap();
    }, []);

    return (
        <>
            <div className="search-box">
                <input type="text" placeholder="지역이나 장소를 검색해 보세요" style={{ width: "70%", height:" 90px", paddingLeft:"20px", margin:"20px 0 20px 40px", borderRadius:"15px", border:"1px solid grey", fontSize:"30px", backgroundColor:"transparent" }}/>
                <button className="search-button" style={{ width: "10%", height:"10%", border:"none", outline:"none", backgroundColor:"transparent", fontSize:"45px", position:"relative", top:"8px", right:"120px" }}>🔍</button>
            </div>
            <div ref={mapElement} id="map" style={{ width: '90%', minHeight: '800px', position: 'relative', top: '20px', left: '50%', transform: 'translateX(-50%)' }}/> 
        </>
    );

    function initMap() {
        if (!mapElement.current || !naver) {
            return;
        }

        const location = new naver.maps.LatLng(37.3595704, 127.105399);
        const mapOptions = {
            center: location,
            zoom: 15,
            zoomControl: true,
        };

        const map = new naver.maps.Map(mapElement.current, mapOptions);
        new naver.maps.Marker({
            position: location,
            map,
        });
    }
}

export default Home;