import React from 'react';
import '../styles/LocationList.css';



const LocationList = ({ locations, selectedMarkerIdx, registerLocation}) => {
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
                        <button onClick={registerLocation}>등록하기</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LocationList;