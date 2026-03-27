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

export default function F1Chart({ selectedModels }: Props) {
  const [mode, setMode] = useState("weighted avg");

  // 🔥 Label mapping (clean UI)
  const modeLabels: Record<string, string> = {
    "0": "Class 0 (No Disease)",
    "1": "Class 1 (Disease)",
    "weighted avg": "Overall (Weighted)",
  };

  // 🔥 Filter based on selected mode + models
  const filtered = report.filter(
    (r: any) =>
      r.Class === mode &&
      selectedModels.includes(r.Model)
  );

  // 🔥 Prepare chart data
  const chartData = filtered.map((r: any) => ({
    Model: r.Model,
    f1: r["f1-score"],
  }));

  return (
    <div className="h-[420px] bg-slate-900 p-4 rounded-xl shadow text-white">
      
      {/* 🔁 Header + Toggle */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          F1 Score — {modeLabels[mode]}
        </h2>

        <div className="flex gap-2">
          {["0", "1", "weighted avg"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded ${
                mode === m ? "bg-blue-600" : "bg-slate-700"
              }`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="Model" />
          <YAxis domain={[0, 1]} />

          <Tooltip
            formatter={(value) =>
              typeof value === "number"
                ? `${(value * 100).toFixed(2)}%`
                : value
            }
          />

          <Bar dataKey="f1" fill="#60a5fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}