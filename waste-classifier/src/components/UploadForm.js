import React, { useState } from 'react';

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [prediction, setPrediction] = useState('');

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
        setPreview(URL.createObjectURL(uploadedFile));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        setPrediction(result.predicted_class);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload and Classify</button>
            </form>
            {preview && (
                <div>
                    <h2>Uploaded Image:</h2>
                    <img src={preview} alt="Uploaded" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                </div>
            )}
            {prediction && (
                <div>
                    <h2>Predicted Class: {prediction}</h2>
                </div>
            )}
        </div>
    );
};

export default UploadForm;
