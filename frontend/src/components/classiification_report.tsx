import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import report from "../data/classification_report.json";
import { useState } from "react";

type Props = {
  selectedModels: string[];
};

export default function PerformanceChart({ selectedModels }: Props) {
  const [mode, setMode] = useState("1");
  const [metric, setMetric] = useState<
    "f1-score" | "recall" | "precision"
  >("f1-score");

  const modeLabels: Record<string, string> = {
    "0": "Class 0 (No Disease)",
    "1": "Class 1 (Disease)",
    "weighted avg": "Overall (Weighted)",
  };

  const metricLabels = {
    "f1-score": "F1 Score",
    "recall": "Recall",
    "precision": "Precision",
  };

  const filtered = report.filter(
    (r: any) =>
      r.Class === mode &&
      selectedModels.includes(r.Model)
  );

  const chartData = filtered.map((r: any) => ({
    Model: r.Model,
    value: r[metric],
  }));

  return (
    <div className="h-[460px] bg-slate-900 p-4 rounded-xl shadow text-white mb-8 flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {metricLabels[metric]} — {modeLabels[mode]}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setMetric("precision")}
            className={`px-3 py-1 rounded ${metric === "precision"
                ? "bg-blue-600"
                : "bg-slate-700"
              }`}
          >
            Precision
          </button>
          <button
            onClick={() => setMetric("recall")}
            className={`px-3 py-1 rounded ${metric === "recall" ? "bg-blue-600" : "bg-slate-700"}`}
          >
            Recall
          </button>
          <button
            onClick={() => setMetric("f1-score")}
            className={`px-3 py-1 rounded ${metric === "f1-score" ? "bg-blue-600" : "bg-slate-700"}`}
          >
            F1
          </button>
        </div>
      </div>

      {/* Class Toggle */}
      <div className="flex gap-2 mb-4">
        {["0", "1", "weighted avg"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded ${mode === m ? "bg-blue-600" : "bg-slate-700"}`}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      {/* 2. Chart Wrapper: flex-1 makes it take up remaining space, min-h-0 prevents overflow */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="Model" stroke="#94a3b8" />
            <YAxis domain={[0, 1]} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              formatter={(value) =>
                typeof value === "number" ? `${(value * 100).toFixed(2)}%` : value
              }
            />
            <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}