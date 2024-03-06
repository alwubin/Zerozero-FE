import React from 'react';
import '../styles/CustomModal.css';

const CustomModal = ({ message, clickHandler }) => {
    return (
        <div className='modalContainer'>
            {message}
            <button className="acceptButton" onClick={clickHandler}>
                확인
            </button>
        </div>
    )
}

export default CustomModal;