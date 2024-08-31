# app.py
from flask import Flask, request, jsonify
import joblib
import numpy as np

# Load the pretrained model
model = joblib.load('house_price_model.pkl')

# Initialize Flask app
app = Flask(__name__)

# Define a route for the API
@app.route('/predict', methods=['POST'])
def predict():
    # Get JSON input data
    input_data = request.json
    
    # Convert input data to numpy array
    features = np.array(input_data['features']).reshape(1, -1)
    
    # Make a prediction
    prediction = model.predict(features)
    
    # Return the prediction result as JSON
    return jsonify({'prediction': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
