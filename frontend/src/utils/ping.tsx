// src/utils/ping.js
export default function wakeUpServer() {
  return async () => {
    try {
      // Replace with your actual Render backend URL health endpoint
      await fetch("https://heart-disease-prediction-tecu.onrender.com/predict"); 
      console.log("Server wake-up signal sent.");
    } catch (err) {
      console.error("Server is still sleeping or unreachable", err);
    }
  };
}