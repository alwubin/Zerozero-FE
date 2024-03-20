import React, { useEffect, useState } from 'react'; 
import axios from 'axios';

import '../styles/Register.css';

function Register() {
    const [images, setImages] = useState([]);

    const handleImageUpload = (e) => {
        const uploadImages = Array.from(e.target.files);
        const selectedImages = uploadImages.slice(0,3);
        setImages([...selectedImages]);
    }

    return (
        <div className='registerModal'>
            <div className='registerContentWrap'>
                <div className='infoTitle'>
                    가게명 :
                </div>
                <div className='infoContent'>
                    스타벅스
                </div>

                <div className='infoTitle'>
                    가게 전화번호 :
                </div>
                <div className='infoContent'>
                    010-1234-5678
                </div>

                <div className='infoTitle'>
                    가게 주소 :
                </div>
                <div className='infoContent'>
                    경기도 용인시 기흥구 보정동 123
                </div>

                
                <div className='infoTitle'>
                    가게 사진
                    <a>사진을 제보해주세요!</a>
                </div>
                <div className='imageContainer'>
                    <input className='imageInput' type="file" accept="image/*" multiple onChange={handleImageUpload} />
                </div>
                <div className="imagePreviewContainer">
                    {images.map((image, index) => (
                        <img key={index} src={URL.createObjectURL(image)} alt={`Uploaded ${index + 1}`} className="imagePreview" />
                    ))}
                </div>

                <button className='registerStoreButton'>가게 등록하기</button>
            </div>
        </div>
    )
}

export default Register;