import '../styles/PopUp.css'

const PopUp = ({ content, onClose}) => {
    return (
        <div className="popupWrap">
            <div className="popupContent">
                <button className="closeButton" onClick={onClose}>X</button>
                {content}
            </div>
        </div>
    );
}

export default PopUp;