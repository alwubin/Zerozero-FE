import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LocationList.css';



const LocationList = ({ locations, selectedMarkerIdx }) => {
    const navigate = useNavigate();
    
    const inquiryStoreDetail = (location) => {
        const storeId = location.storeId;
        const name = location.title;
        const category = location.category;
        const roadAddress = location.roadAddress;
        const mapx = location.mapx;
        const mapy = location.mapy;

        console.log(storeId, name, category, roadAddress, mapx, mapy);

        navigate('/storedetail', { state: { storeId, name, category, roadAddress, mapx, mapy } });
    }

    return (
        <div className='listContainer'>
            <div className='locationCarousel'>
                {locations.map((location, idx) => (
                    <div className='locationWrapper' 
                        key={idx}
                        style={{
                            backgroundColor: selectedMarkerIdx === idx ? '#554647' : 'white',
                            color: selectedMarkerIdx === idx ? '#EAE8E5' : 'black'
                        }}
                    >
                        <strong style={{fontSize:'17px'}}>{location.title}</strong>
                        <p style={{color:'gray', marginTop:'5px', fontSize:'12px'}}>{location.category}</p>
                        <p style={{color: selectedMarkerIdx === idx ? '#EAE8E5' : 'black',
                                marginTop:'8px', fontSize:'15px' }}>{location.address}</p>
                        
                        <button onClick={() => {inquiryStoreDetail(location)}} >
                            더보기
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LocationList;