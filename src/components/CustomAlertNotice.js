import React from 'react';

const CustomAlertNotice = ({ alertMessage }) => {
    return (
        <div className="custom-alert-notice" role="alert">
            <div className="custom-alert-notice-content">
                <div>{alertMessage}</div>
            </div>
        </div>
    )
}

export default CustomAlertNotice;