import React, { useState } from 'react';
import '../styles/RegisteredStoreListModal.css';

const RegisteredStoreListModal = ({ registeredStoreList, clickHandler }) => {
    return (
        <div className="registeredStoreListContainer">
            <div className='registerStoreList'>
                <div className="modalCloseButton" onClick={clickHandler}>
                    X
                </div>
                { registeredStoreList.map((store, idx) => (
                    <React.Fragment key={idx}>
                        <div className='registeredStoreInfo'>
                            <div className='registerStoreTitle'> {store.name} </div>
                            <div className='registerStoreAddress'>
                                {store.roadAddress}
                                <div className='registerStoreCategory'> {store.category} </div>
                            </div>
                        </div>
                        {idx !== registeredStoreList.length - 1 && <hr />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};


export default RegisteredStoreListModal;