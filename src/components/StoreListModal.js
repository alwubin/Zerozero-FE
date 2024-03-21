import React, { useState } from 'react';
import '../styles/StoreListModal.css';

const StoreListModal = ({ locations }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    return (
        <div className='storeListContainer'>
            <div className='storeList'>
                {locations.map((location, idx) => (
                    <React.Fragment key={idx}>
                        <div
                            className={`storeSimpleInfo ${hoveredIndex === idx ? 'hovered' : ''}`}
                            onMouseEnter={() => handleMouseEnter(idx)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => console.log(`판매점명: ${location.title}`)}
                        >
                            <div className='storeTitle'>
                                {location.title}
                            </div>
                            <div className='storeCategory'>
                                {location.category}
                            </div>
                            <div className='storeAddress'>
                                {location.address}
                            </div>
                        </div>
                        {idx !== locations.length - 1 && <hr />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default StoreListModal;