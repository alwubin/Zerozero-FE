import React from 'react';
import { useState, useEffect } from 'react'
import axios from 'axios';
import '../styles/RegisterStoreModal.css'

const RegisterStoreModal = ({ request }) => {
    const [images, setImages] = useState([]);

    const handleImageUpload = (e) => {
        const uploadImages = Array.from(e.target.files);
        const selectedImages = uploadImages.slice(0,3);
        setImages(selectedImages);
    }

    const registerLocation = () => {
        const formData = new FormData();
        images.forEach((image, index) => {
            formData.append(`image${index + 1}`, image);
        });

        const requestData = {
            title: request.title,
            mapx: request.mapx,
            mapy: request.mapy,
            address: request.address
        };

        formData.append('requestData', JSON.stringify(requestData));

        axios.post(`http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/stores`, 
        formData,
            { 
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                } 
            }
        )
        .then((res) => {
            console.log('성공적으로 등록되었습니다!')
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const handleRegisterButtonClick = () => {
        registerLocation();
    }

    return (
        <div className='registerModal'>
            <div className='registerContentWrap'>
                <div className='infoTitle'>
                    가게명 :
                </div>
                <div className='infoContent'>
                    {request.title}
                </div>

                <div className='infoTitle'>
                    가게 주소 :
                </div>
                <div className='infoContent'>
                    {request.address}
                </div>

                
                <div className='infoTitle'>
                    가게 사진
                    <a>사진을 제보해주세요!</a>
                </div>
                <div className='imageContainer'>
                    <input className='imageInput' type="file" accept="image/*" multiple onChange={handleImageUpload} />
                </div>

                <button className='registerStoreButton' onClick={handleRegisterButtonClick}>등록</button>
            </div>
        </div>
    )
}

export default RegisterStoreModal;