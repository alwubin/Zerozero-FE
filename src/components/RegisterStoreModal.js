import React from 'react';
import { useState, useEffect } from 'react'
import axios from 'axios';
import '../styles/RegisterStoreModal.css'

const RegisterStoreModal = ({ request }) => {

    const registerLocation = () => {
        axios.post(`http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/stores`, 
            { 
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                } 
            },
            {
                "request": {
                  "title": request.title,
                  "mapx": request.mapx,
                  "mapy": request.mapy
                },
                "images": [
                  "string"
                ]
            }
        )
        .then((res) => {
            
        })
        .catch((err) => {
            console.log(err);
        })
    }
    return (
        <div className='contentWrapper'>
            <div className='itemsWrapper'>
                <div className='storeTitle'>
                    <div>
                        <h3>가게 이름</h3>
                    </div>
                    <div>
                        {request.title}
                    </div>
                </div>
                <div className='zreoBeverage'>
                    <div>
                        <h3>판매중인 제로 음료수</h3>
                    </div>
                    <div>
                        <ul className='zeroList'>
                            <li>코카콜라 제로</li>
                            <li>펩시 제로</li>
                            <li>스프라이트 제로</li>
                            <li>칠성사이다 제로</li>
                            <li>탐스 제로</li>
                            <li>웰치스 제로</li>
                            <li>환타 제로</li>
                            <li>닥터페퍼 제로</li>
                            <li>밀키스 제로</li>
                        </ul>
                    </div>
                </div>
                <div className='storeImage'>
                    <div>
                        <h3>가게 사진</h3>
                        사진을 제보해주세요!
                    </div>
                    <div>
                        
                    </div>
                </div>
                <button onClick={registerLocation}>가게 등록하기</button>
            </div>
        </div>
    )
}

export default RegisterStoreModal;