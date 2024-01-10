import { useEffect, useRef } from "react";

const NaverMap = () => {
    let mapElement = useRef(null);
    let { naver } = window;

    useEffect(() => {
        initMap();
    }, []);

    return (
        <>
            <h1>Zerozero : 제로 음료수 판매 지도</h1>
            <div ref={mapElement} id="map" style={{ width: '1920px', height: '1080px' }} />
        </>
    );

    function initMap() {
        if (!mapElement.current || !naver) {
            return;
        }

        const location = new naver.maps.LatLng(37.566826, 126.9786567);
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

export default NaverMap;