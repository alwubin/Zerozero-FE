import React, { useState } from 'react';
import '../styles/RegisteredStoreListModal.css';

const RegisteredStoreListModal = ({ registeredStoreList, clickHandler }) => {
    return (
        <div className="registeredStoreListWrap" onClick={clickHandler}>
            {
                registeredStoreList.map((store, idx) => (
                    <div className='registeredStoreListContent' key={idx}>
                        {/* <div className='storeId'> {idx + 1} </div> */}
                        <div className='storeName'> {store.name} </div>
                        <div className='storeAddress'>
                            {store.roadAddress}
                            <div> {store.category} </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default RegisteredStoreListModal;