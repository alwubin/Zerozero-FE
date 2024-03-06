import React from "react";

const CustomAlert = ({ message }) => {
    return (
        <div className="custom-alert">
            <div className="custom-alert-content" style={{margin:'0px'}}>
                {message}
            </div>
        </div>
    )
}

export default CustomAlert;