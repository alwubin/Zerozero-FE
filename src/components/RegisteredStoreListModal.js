import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisteredStoreListModal.css';

const RegisteredStoreListModal = ({ registeredStoreList, clickHandler }) => {
    const [storeId, setStoreId] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setStoreId(storeId);

    }, )

    
    const moveToStoreDetail = (store) => {
        const storeId = store.storeId;
        setStoreId(storeId);
        navigate('/storedetail', { state: { storeId } });
    }

    return (
        <div className="registeredStoreListContainer">
            <div className='registerStoreList'>
                <div className="modalCloseButton">
                    X
                </div>
                { registeredStoreList.map((store, idx) => (
                    <React.Fragment key={idx}>
                        <div className='registeredStoreInfo' onClick={() => moveToStoreDetail(store)}>
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