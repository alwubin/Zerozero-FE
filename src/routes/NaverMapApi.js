import React from "react";
import { NavermapsProvider, Marker, Container as MapDiv, NaverMap } from "react-naver-maps";

const NaverMapApi = (props) => {
    return (
        <NavermapsProvider
            npcClientId = {process.env.REACT_APP_API_CLIENT_ID}
        >
                <MapDiv 
                mapDivId="maps-getting-started-uncontrolled"
                style={{ width: '100%', height: '100%' }}
                center={{ lat: props.Latitude, lng: props.Longitude }}
                defaultZoom={props.zoom}
                zoom={props.zoom}
                minZoom={props.zoom}
                enableWheelZoom={false}
                >
                    <NaverMap>
                        {props.zoom === 15&& (
                            <Marker 
                                position={{ lat: props.Latitude, lng: props.Longitude }}
                                title={props.roadAddress}
                                clickable={true}
                            />
                        )}
                    </NaverMap>
                </MapDiv>
        </NavermapsProvider>
    );
}

export default NaverMapApi;