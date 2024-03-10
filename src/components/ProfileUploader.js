import {useEffect, useState} from 'react';
import axios from 'axios';
import '../styles/ProfileUploader.css';


const ProfileUploader = ({ onClose, setProfileImage }) => {

    const [image, setImage] = useState({
        image: '',
        preview: 'default.png',
    });

    let inputRef;

    const saveImage = (e) => {
        e.preventDefault();
        if(e.target.files[0]) { //새로운 이미지를 선택할 시 기존 url 폐기
            URL.revokeObjectURL(image.preview);
            const preview = URL.createObjectURL(e.target.files[0]);

            setImage(() => (
                {
                    image: e.target.files[0],
                    preview: preview
                }
            ));

            setProfileImage(preview);
        }
    }
    
    useEffect(() => {
        return () => {
            URL.revokeObjectURL(image.preview);
        }
    }, []);

    const sendImageToServer = async() => {
        if (image.image) {
            const formData = new FormData();
            formData.append('profileImage', image.image);
            await axios.post('http://ec2-3-35-98-32.ap-northeast-2.compute.amazonaws.com:8080/api/v1/users/upload-profile', 
                formData,
                { 
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    } 
                });
            alert('업로드 성공!');
            setImage({
                image: '',
                preview: 'default.png'
            });
            onClose();
        }
        else {
            alert('사진을 등록하세요.')
        }
    }

    return (
        <div className='uploaderWrapper'>
            <input 
                type='file' 
                accept='image/*' 
                ref={refParam => inputRef = refParam} 
                onChange={saveImage}
                onClick={(e) => e.target.value = null}
                style={{display: 'none'}}
            />
            <div className='buttonWrapper'>
                <button className='uploaderButton' onClick={() => {inputRef.click();}}>찾아보기</button>
                <button className='uploaderButton' onClick={sendImageToServer}>저장</button>
            </div>
        </div>
    )
}

export default ProfileUploader;