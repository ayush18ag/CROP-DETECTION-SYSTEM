import { useState } from "react";
import "./App.css";
import axios from 'axios';


function App() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create a local URL just for previewing
      setPreviewUrl(URL.createObjectURL(file));
      // Reset previous results when new image is picked
      setResult(null); 
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    // CRITICAL: The string "image" here must match upload.single('image') in backend
    formData.append("image", image);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);
      console.log("Response from backend:", data);

      if (data.status === 'fail' || !data) {
        alert("Error: " + (data.message || "Upload failed"));
        return;
      }

      // Assuming your backend sends back 'data' and 'description' or similar
      setResult(data);
    } catch (error) {
      setLoading(false);
      alert("Server error. Is the backend running?");
      console.log(error);
    }
  };

  return (
    <div className="app-container">
      
      <div className="hero">
        <h1 className="hero-title">🌱 Crop Disease Detection</h1>
        <p className="hero-subtitle">
          Upload a leaf image & get instant AI-powered disease analysis
        </p>
      </div>

      <div className="upload-container">
        {/* Hidden Input */}
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />

        {/* 🌟 Upload Card Section */}
        <div className="upload-card">
          <h3 className="card-title">Upload Leaf Image</h3>

          <div
            className="upload-zone"
            onClick={() => document.getElementById("fileInput").click()}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            {/* LOGIC: Show Image IF exists, ELSE show Text */}
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Selected Preview" 
                className="preview" 
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
              />
            ) : (
              <div className="placeholder-text">
                <p>Click or Drag & Drop Image Here</p>
                <span style={{ fontSize: '2rem' }}>📂</span>
              </div>
            )}
          </div>

          <label htmlFor="fileInput" className="upload-label">
            {previewUrl ? "Change Image" : "Select Image"}
          </label>
        </div>
      </div>

      <button
        className="analyze-btn"
        onClick={handleAnalyze}
        disabled={!image || loading}
      >
        {loading ? "Analyzing..." : "Analyze Disease"}
      </button>

      {/* Result Display */}
      {result && (
       <div className="result-box">
    <h3>Analysis Result</h3>
    <p><b>status: </b>{result.status}</p>
    <p><b>Predicted Class:</b> {result.predicted_class}</p>
    <p><b>Confidence:</b> {result.confidence}</p>
  </div>
      )}
    </div>
  );
}

export default App;