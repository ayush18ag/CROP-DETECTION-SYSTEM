from fastapi import FastAPI,File, UploadFile 
from PIL import Image
import io 
from fastapi.middleware.cors import CORSMiddleware
import numpy as np 
import tensorflow as tf 
from tensorflow import keras
# from tensorflow.keras.applications.efficientnet import preprocess_input
model_path=('/Users/ayushagrawal/Desktop/crop disease detection +frazile recomandton /pythonfile/BEST_CROP_MODEL.h5')
model= tf.keras.models.load_model(model_path)
print("model load sucessful")


class_name = [
    "Pepper__bell___Bacterial_spot",
    "Pepper__bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites_Two_spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]


app = FastAPI() 

@app.post("/process_image",)

async def process_image(file:UploadFile = File(...)):
    # image_bytes = await file.read()
    
    image_bytes = await file.read()
    
    # # 1. Open as RGB
    # img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # # 2. Resize
    # img = img.resize((224, 224))
    
    # # 3. Convert to Array (Do NOT divide by 255 here!)
    # img_array = np.array(img) 
    
    # # 4. Use the official Preprocessor (Matches training exactly)
    # img_array = preprocess_input(img_array)
    
    # # 5. Expand dims
    # img_array = np.expand_dims(img_array, axis=0)

  
    # ... rest of your code ...

    img= Image.open(io.BytesIO(image_bytes)).convert("RGB")
    target = (224,224)
    # img =img.resize((224,224))
    img =img.resize(target)

  
    # width , height = img.size

    img_array = np.array(img) / 255.0   
    img_array = np.expand_dims(img_array,axis=0)

    try:
        # prediction = model.predict(img_array)[0]
          # Predict
        prediction = model.predict(img_array)[0]
        confidence = float(np.max(prediction))
        class_index = int(np.argmax(prediction))
        predicted_class = class_name[class_index]

        print("Image batch shape:", img_array.shape)
        
        print(f" Prediction: {predicted_class} ({confidence}){class_index}")

        return {
            "status": "success",
            "predicted_class": predicted_class,
            "confidence": round(confidence, 4),
        }
    except Exception as e:
        print(f" Error during prediction: {e}")
        return {"status": "error", "message": str(e)}