import MetricsChart from "./components/metrics";
import ROCChart from "./components/roc_curve";
import F1Chart from "./components/classiification_report";
import ConfusionMatrix from "./components/confusion_matrix";
import PredictionScatter from "./components/pred_prob_dist";

import { useState } from "react";

import metrics from "./data/metrics.json";
import PageToggle from "./components/PageToggle";

export default function Analysis() {
  // 🔥 Get all models
  const allModels = [
  ...new Set(metrics.map((m: { Model: string }) => m.Model)),
];

  // 🔥 Global selected models
  const [selectedModels, setSelectedModels] = useState<string[]>(allModels[0] ? [allModels[0]] : []); // default to first model if exists

  // 🔁 Toggle model selection
  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model)
        ? prev.filter((m) => m !== model)
        : [...prev, model]
    );
  };

  return (
    <div className="p-6 space-y-8 text-white bg-gradient-to-br from-slate-900 to-slate-800">
      <PageToggle />
      <h1 className="text-3xl font-bold">
        Model Analysis
      </h1>

      <button onClick={() => setSelectedModels(allModels)} className="px-3 py-1 mr-2 rounded bg-slate-700 hover:bg-blue-600">
        Select All
      </button>

      <button onClick={() => setSelectedModels([])} className="px-3 py-1 mr-2 rounded bg-slate-700 hover:bg-blue-600">
        Clear All
      </button>

      {/* 🔥 Model Filter UI */}
      <div className="flex flex-wrap gap-2">
        {allModels.map((model) => (
          <button
            key={model}
            onClick={() => toggleModel(model)}
            className={`px-3 py-1 rounded ${selectedModels.includes(model)
                ? "bg-blue-600"
                : "bg-slate-700"
              }`}
          >
            {model}
          </button>
        ))}
      </div>

      {/* 🔥 Pass selected models to all charts */}
      <MetricsChart selectedModels={selectedModels} />
      <ROCChart selectedModels={selectedModels} />
      <F1Chart selectedModels={selectedModels}/>
      <ConfusionMatrix selectedModels={selectedModels}/>
      <PredictionScatter selectedModels={selectedModels}/>
    </div>
  );
}