from PIL import Image
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import bcrypt
import jwt
import datetime
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# ---------------- MongoDB ---------------- #

mongo_uri = os.getenv("MONGO_URI")

print("Mongo URI:", mongo_uri)

client = MongoClient(mongo_uri)

db = client["livestock_ai"]

users = db["users"]

secret_key = os.getenv("SECRET_KEY")

model = tf.keras.models.load_model("livestock_model.h5")

# ---------------- HOME ---------------- #

@app.route('/')
def home():
    return {
        "message": "Livestock AI Backend Running"
    }

# ---------------- SIGNUP ---------------- #

@app.route('/signup', methods=['POST'])
def signup():

    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    existing_user = users.find_one({
        "email": email
    })

    if existing_user:
        return jsonify({
            "message": "User already exists"
        }), 400

    hashed_password = bcrypt.hashpw(
        password.encode('utf-8'),
        bcrypt.gensalt()
    )

    users.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password
    })

    return jsonify({
        "message": "Signup successful"
    })

# ---------------- LOGIN ---------------- #

@app.route('/login', methods=['POST'])
def login():

    data = request.json

    email = data.get("email")
    password = data.get("password")

    if email and password:

        token = jwt.encode({
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, secret_key, algorithm="HS256")

        return jsonify({
            "message": "Login successful",
            "token": token
        })

    return jsonify({
        "message": "Invalid credentials"
    }), 401

# ---------------- REAL AI PREDICT ---------------- #

@app.route('/predict', methods=['POST'])
def predict():

    if 'image' not in request.files:

        return jsonify({
            "message": "No image uploaded"
        }), 400

    file = request.files['image']

    file_path = f"uploads/{file.filename}"

    file.save(file_path)

    # Load image
    img = image.load_img(
        file_path,
        target_size=(224, 224)
    )

    img_array = image.img_to_array(img)

    img_array = np.expand_dims(img_array, axis=0)

    img_array = img_array / 255.0

    # Predict
    prediction = model.predict(img_array)

    class_names = [
        "Foot and Mouth Disease",
        "Healthy",
        "Lumpy Skin Disease",
        "Mastitis"
    ]

    predicted_class = class_names[np.argmax(prediction)]

    confidence = float(np.max(prediction)) * 100

    precautions = {

        "Foot and Mouth Disease":
        "Isolate the animal and contact veterinary doctor immediately.",

        "Healthy":
        "Animal appears healthy. Continue regular monitoring.",

        "Lumpy Skin Disease":
        "Keep animal hydrated and separate from other livestock.",

        "Mastitis":
        "Maintain udder hygiene and consult veterinarian."
    }

    return jsonify({

        "prediction": predicted_class,

        "confidence": round(confidence, 2),

        "precaution": precautions[predicted_class]
    })

# ---------------- MAIN ---------------- #

if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)