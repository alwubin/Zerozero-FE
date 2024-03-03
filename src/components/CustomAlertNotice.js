import React from 'react';

const CustomAlertNotice = ({ message }) => {
    return (
        <div className="custom-alert-notice" role="alert">
            <div className="custom-alert-notice-content">
                {message}
            </div>
        </div>
    )
}

export default CustomAlertNotice;