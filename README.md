# Garbage Classifier

This project is a web application that classifies garbage images into different categories using a pre-trained Keras model. The application is built using Flask for the backend and React for the frontend.

## Project Structure

- `app.py`: The Flask backend that handles image uploads and predictions.
- `Major_Project.ipynb`: Jupyter notebook for model training and experimentation.
- `my_keras_model.h5`: Pre-trained Keras model.
- `requirements.txt`: Python dependencies for the Flask backend.
- `uploads/`: Directory to store uploaded images.
- `waste-classifier/`: React frontend application.

## Setup

### Backend

1. Create a virtual environment and activate it:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

2. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

3. Run the Flask application:
    ```sh
    python app.py
    ```

### Frontend

1. Navigate to the `waste-classifier` directory:
    ```sh
    cd waste-classifier
    ```

2. Install the required dependencies:
    ```sh
    npm install
    ```

3. Start the React application:
    ```sh
    npm start
    ```

## Usage

1. Open the React application in your browser at `http://localhost:3000`.
2. Upload an image or capture one using the webcam.
3. Click the "Submit" button to get the predicted class of the garbage.

## API

### `/predict` (POST)

Endpoint to upload an image and get the predicted class.

- **Request**: `multipart/form-data` with a file field named `file`.
- **Response**: JSON object with the predicted class.

