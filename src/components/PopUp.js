const PopUp = ({ content, onClose}) => {
    return (
        <div className="popupWrapper">
            <div className="popupContent">
                <button className="closeButton" onClick={onClose}>X</button>
                {content}
            </div>
        </div>
    );
}

export default PopUp;