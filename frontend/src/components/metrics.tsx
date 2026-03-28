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
    <div className="h-[420px] p-4 rounded-xl shadow bg-slate-900 text-white mb-8 flex flex-col">

      {/* 🔁 Toggle (This takes up a fixed amount of space) */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Model Performance
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMetric("Accuracy")}
            className={`px-3 py-1 rounded transition-colors ${selectedMetric === "Accuracy" ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"
              }`}
          >
            Accuracy
          </button>

          <button
            onClick={() => setSelectedMetric("ROC_AUC")}
            className={`px-3 py-1 rounded transition-colors ${selectedMetric === "ROC_AUC" ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"
              }`}
          >
            ROC AUC
          </button>
        </div>
      </div>

      {/* 📊 Chart Wrapper: 'flex-1' fills remaining space, 'min-h-0' prevents overflow */}
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="Model"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              domain={[0, 1]}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              tickFormatter={(val) => `${val * 100}%`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.1)' }}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              formatter={(value) =>
                typeof value === 'number'
                  ? `${(value * 100).toFixed(2)}%`
                  : value
              }
            />

            <Bar
              dataKey={selectedMetric}
              fill={metricColors[selectedMetric] || "#60a5fa"}
              animationDuration={500}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}