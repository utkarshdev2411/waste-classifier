import React, { useRef, useState } from 'react';
import styles from './UploadForm.module.css';

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [prediction, setPrediction] = useState('');
    const [cameraOpen, setCameraOpen] = useState(false);

    const videoRef = useRef();

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
        setPreview(URL.createObjectURL(uploadedFile));
        setPrediction('');
    };

    const captureImageFromWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraOpen(true);
            }
        } catch (err) {
            console.error('Error accessing webcam:', err);
        }
    };

    const closeCamera = () => {
        const stream = videoRef.current.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
            setCameraOpen(false);
        }
    };

    const takeSnapshot = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            setFile(blob);
            setPreview(URL.createObjectURL(blob));
            setPrediction('');
            closeCamera();
        }, 'image/jpeg');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            alert('Please upload a file or capture an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        setPrediction(result.class);
    };

    const handleClear = () => {
        setPreview('');
        setPrediction('');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.h1}>Garbage Classifier</h1>
            {/* <form onSubmit={handleSubmit} className={styles.form}>
                <input type="file" onChange={handleFileChange} />
            </form> */}
            <label htmlFor="file" className={styles['custum-file-upload']}>
                <div className={styles.icon}>
                    <svg viewBox="0 0 24 24" fill="" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z" fill=""></path>
                    </svg>
                </div>
                <div className={styles.text}>
                    <span>Click to upload image</span>
                </div>
                <input id="file" type="file" onChange={handleFileChange} />
            </label>
            <div className={styles.webcamControls}>
                {!cameraOpen ? (
                    <button className={styles.button} onClick={captureImageFromWebcam}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none" className="svg-icon"><g strokeWidth="2" strokeLinecap="round" stroke="#fff" fillRule="evenodd" clipRule="evenodd"><path d="m4 9c0-1.10457.89543-2 2-2h2l.44721-.89443c.33879-.67757 1.03131-1.10557 1.78889-1.10557h3.5278c.7576 0 1.4501.428 1.7889 1.10557l.4472.89443h2c1.1046 0 2 .89543 2 2v8c0 1.1046-.8954 2-2 2h-12c-1.10457 0-2-.8954-2-2z"></path><path d="m15 13c0 1.6569-1.3431 3-3 3s-3-1.3431-3-3 1.3431-3 3-3 3 1.3431 3 3z"></path></g></svg>
                        <span className={styles.lable}>Take a Photo</span>
                    </button>
                ) : (
                    <>
                        <button onClick={takeSnapshot} className={styles.button}>
                            Take Snapshot
                        </button>
                        <button onClick={closeCamera} className={styles.button}>
                            Close Camera
                        </button>
                    </>
                )}
            </div>
            <button type="button" onClick={handleClear} className={styles.clearButton}>
                Clear
            </button>
            {preview && (
                <div className={styles.preview}>
                    <h2>Uploaded Image:</h2>
                    <img src={preview} alt="Uploaded" />
                    <button type="button" onClick={handleSubmit} className={styles.btn}>
                    Submit
                    </button>
                </div>
            )}
            {prediction && (
                <div className={styles.preview}>
                    <h2 className={styles.h1}>Predicted Class: {prediction}</h2>
                </div>
            )}
            <video ref={videoRef} autoPlay muted className={styles.videoPreview}></video>
        </div>
    );
};

export default UploadForm;
