import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import rawMetrics from "../data/metrics.json";

export default function MetricsChart({ selectedModels }: any) {
  const [selectedMetric, setSelectedMetric] = useState("Accuracy");

  // 🔥 Transform long → wide
  const transformedData = Object.values(
    rawMetrics.reduce((acc: any, curr: any) => {
      if (!acc[curr.Model]) {
        acc[curr.Model] = { Model: curr.Model };
      }
      acc[curr.Model][curr.Metric] = curr.Value;
      return acc;
    }, {})
  );

  const filteredData = transformedData.filter((d: any) =>
    selectedModels.includes(d.Model)
  );

  // 🎨 Metric-based colors
  const metricColors: Record<string, string> = {
    Accuracy: "#60a5fa",
    ROC_AUC: "#f87171",
  };

  return (
    <div className="h-[420px] p-4 rounded-xl shadow text-white">

      {/* 🔁 Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Model Performance
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMetric("Accuracy")}
            className={`px-3 py-1 rounded ${selectedMetric === "Accuracy"
              ? "bg-blue-600"
              : "bg-slate-700"
              }`}
          >
            Accuracy
          </button>

          <button
            onClick={() => setSelectedMetric("ROC_AUC")}
            className={`px-3 py-1 rounded ${selectedMetric === "ROC_AUC"
              ? "bg-blue-600"
              : "bg-slate-700"
              }`}
          >
            ROC AUC
          </button>
        </div>
      </div>

      {/* 📊 Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData}>
          <XAxis dataKey="Model" />
          <YAxis domain={[0, 1]} />
          <Tooltip
            formatter={(value) =>
              typeof value === 'number'
                ? `${(value * 100).toFixed(2)}%`
                : value
            }
          />

          <Bar
            dataKey={selectedMetric}
            fill={metricColors[selectedMetric]}
            animationDuration={500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}