# 🫀 Heart Disease Risk Prediction & Analysis

A full-stack machine learning web application that predicts the **10-year risk of coronary heart disease (CHD)** and provides an interactive dashboard for **model comparison and performance analysis**.

---

## 🚀 Features

### 🔮 Prediction System

* Select from multiple ML models
* Input patient health data
* Get:

  * Predicted class (CHD / No CHD)
  * Probability score (risk level)

---

### 📊 Analysis Dashboard

Interactive visualizations for comparing models:

* 📈 ROC Curve
* 📊 Accuracy & AUC comparison
* 🎯 Precision, Recall, F1-score (Class-wise)
* 🔲 Confusion Matrix (heatmap)
* 📉 Probability Distribution (Histogram)

---

### 🧠 Key Insights

* Handles **class imbalance (~15% CHD cases)**
* Emphasizes **recall for disease detection**
* Demonstrates trade-offs between:

  * Precision vs Recall
  * Accuracy vs Real-world usefulness

---

## 🏗️ Tech Stack

### Frontend

* React (TypeScript)
* Tailwind CSS
* Recharts (data visualization)

### Backend

* FastAPI (Python)
* Scikit-learn
* XGBoost, CatBoost

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 🤖 Machine Learning Models

The following models were trained and compared:

* K-Nearest Neighbors (KNN)
* Logistic Regression
* Naive Bayes
* Decision Tree
* Support Vector Machine (SVM)
* Random Forest
* XGBoost
* CatBoost

---

## ⚙️ How It Works

### 1. Training Phase

* Load Framingham dataset
* Preprocess and scale features
* Train multiple ML models
* Evaluate using:

  * Accuracy, Precision, Recall, F1-score
  * ROC-AUC
  * Confusion Matrix
* Save models and metrics

---

### 2. Backend (FastAPI)

* Loads trained models and scalers
* Accepts user input via API
* Applies preprocessing
* Returns:

  * Prediction
  * Probability scores

---

### 3. Frontend (React)

* Prediction page for user input
* Analysis page for model comparison
* Dynamic charts powered by JSON data

---

## 📊 Evaluation Metrics

| Metric    | Description                         |
| --------- | ----------------------------------- |
| Accuracy  | Overall correctness                 |
| Precision | Correctness of positive predictions |
| Recall    | Ability to detect actual CHD cases  |
| F1-score  | Balance between precision & recall  |
| ROC-AUC   | Model discrimination capability     |

> ⚠️ In medical prediction, **recall (Class 1)** is especially important to minimize missed disease cases.

---

## 🌐 Live Demo

Frontend: *https://heart-disease-prediction-pied.vercel.app/*
Backend API: *https://heart-disease-prediction-tecu.onrender.com/docs*

---

## ⭐ Acknowledgements

* Framingham Heart Study Dataset
* Scikit-learn Documentation
* Recharts Library

---

## 📌 Note

This project is intended for **educational purposes only** and should not be used for real medical diagnosis.
