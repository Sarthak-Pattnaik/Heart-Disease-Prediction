import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import rawMetrics from "../data/metrics.json";
import rocData from "../data/roc_curve.json";

export default function ROCChart({ selectedModels }: any) {
  // 🔥 Get unique model names
  const aucMap: Record<string, number> = {};

  rawMetrics.forEach((m: any) => {
    if (m.Metric === "ROC_AUC") {
      aucMap[m.Model] = m.Value;
    }
  });

  return (
    <div className="h-96 bg-slate-900 p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        ROC Curve Comparison
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart>
          <XAxis
            type="number"
            dataKey="FPR"
            domain={[0, 1]}
            label={{ value: "False Positive Rate", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis
            type="number"
            dataKey="TPR"
            domain={[0, 1]}
            label={{ value: "True Positive Rate", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) =>
              typeof value === 'number'
                ? `${(value * 100).toFixed(2)}%`
                : value
            }
          />
          <Legend />

          {/* 🔥 Plot one line per model */}
          <>
            {/* 🔥 Model curves */}
            {selectedModels.map((model: string) => {
              const modelData = rocData
                .filter((d: any) => d.Model === model)
                .sort((a: any, b: any) => a.FPR - b.FPR);

              return (
                <Line
                  key={model}
                  data={modelData}
                  type="monotone"
                  dataKey="TPR"
                  name={`${model} (AUC = ${aucMap[model]?.toFixed(2)})`}
                  dot={false}
                />
              );
            })}

            {/* 🔥 Random Guess baseline (ONLY ONCE) */}
            <Line
              data={[
                { FPR: 0, TPR: 0 },
                { FPR: 1, TPR: 1 },
              ]}
              dataKey="TPR"
              strokeDasharray="5 5"
              name="Random Guess"
              dot={false}
            />
          </>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}