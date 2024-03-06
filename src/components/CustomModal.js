import React from 'react';

// const backgroundStyle = { 
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     zIndex: '1000',
//     position: 'fixed',
//     maxWidth: '500px',
//     width: '100%',
//     top: '0',
//     left: '0',
// }

// const containerStyle = {
//     width: '80px',
//     heigth: '50px',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: '5px',
//     border: '1px solid white',
//     backgroundColor: 'white',
// }

const containerStyle = {
    maxWidth: '200px',
    width: '100%',
    height: '80px',
    zIndex: '9999',
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '25px 20px 20px 20px',
    textAlign: 'center',
    fontWeight: '600',

    backgroundColor: 'white',
    borderRadius: '8px',
}

const buttonStyle = {
    width: '35%',
    height: '30%',
    zIndex: '10000',
    marginTop: '30px',
    backgroundColor: '#212121',
    borderRadius: '8px',
    fontWeight:'600',
    color: '#EBEBEB',
    fontSize: '13px',
    cursor: 'pointer',
}

const CustomModal = ({ message, clickHandler }) => {
    return (
        <div className='modalContainer' style={containerStyle}>
            {message}
            <button className="closeButton" style={buttonStyle} onClick={clickHandler}>
                확인
            </button>
        </div>
    )
}

export default CustomModal;