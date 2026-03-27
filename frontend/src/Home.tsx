import { useState } from "react";
import PageToggle from "./components/PageToggle";

const models = [
    { key: "knn", label: "KNN" },
    { key: "svm", label: "SVM" },
    { key: "logistic", label: "Logistic Regression" },
    { key: "naive_bayes", label: "Naive Bayes" },
    { key: "decision_tree", label: "Decision Tree" },
    { key: "random_forest", label: "Random Forest" },
    { key: "xgboost", label: "XGBoost" },
    { key: "catboost", label: "CatBoost" },
];

// ✅ Feature names (order MUST match training data)
const featureNames = [
    "male",
    "age",
    "education",
    "currentSmoker",
    "cigsPerDay",
    "BPMeds",
    "prevalentStroke",
    "prevalentHyp",
    "diabetes",
    "totChol",
    "sysBP",
    "diaBP",
    "BMI",
    "heartRate",
    "glucose",
];

const binaryFields = [
    "male",
    "currentSmoker",
    "BPMeds",
    "prevalentStroke",
    "prevalentHyp",
    "diabetes",
];

const featureLabels: Record<string, string> = {
    male: "Male?",
    age: "Age (years)",
    education: "Education Level",
    currentSmoker: "Smoker?",
    cigsPerDay: "Cigarettes per Day",
    BPMeds: "On BP Medication?",
    prevalentStroke: "History of Stroke?",
    prevalentHyp: "Hypertension?",
    diabetes: "Diabetes?",
    totChol: "Total Cholesterol (mg/dL)",
    sysBP: "Systolic Blood Pressure (mmHg)",
    diaBP: "Diastolic Blood Pressure (mmHg)",
    BMI: "Body Mass Index (BMI)",
    heartRate: "Heart Rate (bpm)",
    glucose: "Glucose Level (mg/dL)",
};

const educationOptions = [
    { value: 1, label: "Some High School" },
    { value: 2, label: "High School or GED" },
    { value: 3, label: "Some College / Vocational School" },
    { value: 4, label: "College Graduate or Higher" },
];

export default function Home() {
    const [selectedModel, setSelectedModel] = useState("logistic");
    const [features, setFeatures] = useState<number[]>(
        Array(featureNames.length).fill(0)
    );
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = Number(value);
        setFeatures(newFeatures);
    };

    const samples = {
        lowRisk: [
            0, 30, 4, 0, 0, 0, 0, 0, 0, 180, 110, 70, 22, 65, 85
        ],
        highRisk: [
            1, 60, 2, 1, 25, 1, 0, 1, 1, 260, 170, 100, 32, 85, 140
        ]
    };

    const handleAutoFill = (type: "lowRisk" | "highRisk") => {
        setFeatures(samples[type]);
    };

    const handlePredict = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://heart-disease-prediction-tecu.onrender.com/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: selectedModel,
                    features,
                }),
            });

            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            alert("Error connecting to backend");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white">
            <PageToggle />
            <div className="bg-slate-900/70 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-7xl">

                <h1 className="text-3xl font-bold mb-6 text-center">
                    Heart Disease Prediction
                </h1>

                {/* Model Selection */}
                <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-300">
                        Select Model
                    </label>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700"
                    >
                        {models.map((m) => (
                            <option key={m.key} value={m.key}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 mb-3">
                    <button
                        onClick={() => handleAutoFill("lowRisk")}
                        className="w-1/2 bg-green-600 p-2 rounded"
                    >
                        Low Risk Sample
                    </button>

                    <button
                        onClick={() => handleAutoFill("highRisk")}
                        className="w-1/2 bg-red-600 p-2 rounded"
                    >
                        High Risk Sample
                    </button>
                </div>

                {/* Feature Inputs */}
                <div className="grid grid-cols-5 gap-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                    {featureNames.map((name, i) => (
                        <div key={i}>
                            <label className="text-xs text-gray-400">
                                {featureLabels[name]}
                            </label>

                            {/* 🔥 Education Dropdown */}
                            {name === "education" ? (
                                <select
                                    value={features[i]}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700"
                                >
                                    {educationOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                            ) : binaryFields.includes(name) ? (

                                /* Binary dropdown */
                                <select
                                    value={features[i]}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700"
                                >
                                    <option value={0}>No</option>
                                    <option value={1}>Yes</option>
                                </select>

                            ) : (

                                /* Normal numeric input */
                                <input
                                    type="number"
                                    value={features[i]}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700"
                                />

                            )}
                        </div>
                    ))}
                </div>

                {/* Predict Button */}
                <button
                    onClick={handlePredict}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
                >
                    {loading ? "Predicting..." : "Predict"}
                </button>

                {/* Result */}
                {result && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Prediction:{" "}
                            {result.prediction === 1
                                ? "High Risk (CHD)"
                                : "Low Risk"}
                        </h2>

                        {result.probabilities && (
                            <div className="space-y-2">
                                {result.probabilities.map((p: number, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm">
                                            <span>{i === 1 ? "High Risk" : "Low Risk"}</span>
                                            <span>{(p * 100).toFixed(2)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${i === 1 ? "bg-red-400" : "bg-green-400"
                                                    }`}
                                                style={{ width: `${p * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}