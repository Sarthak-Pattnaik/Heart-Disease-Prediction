import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import preds from "../data/predictions.json";

type Props = {
  selectedModels: string[];
};

export default function PredictionHistogram({ selectedModels }: Props) {
  const bins = 10;

  // 🔥 Create histogram
  const createHistogram = (data: any[]) => {
    const binSize = 1 / bins;

    const histogram = Array.from({ length: bins }, (_, i) => ({
      bin: `${(i * binSize).toFixed(1)}-${((i + 1) * binSize).toFixed(1)}`,
      class0: 0,
      class1: 0,
    }));

    data.forEach((p) => {
      const index = Math.min(
        Math.floor(p.Probability / binSize),
        bins - 1
      );

      if (p.Actual === 0) histogram[index].class0++;
      else histogram[index].class1++;
    });

    return histogram;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">
        Probability Distribution (Histogram)
      </h2>

      {/* 🔥 Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {selectedModels.map((model) => {
          const modelData = preds.filter(
            (p: any) => p.Model === model
          );

          const histData = createHistogram(modelData);

          return (
            <div
              key={model}
              className="bg-slate-900 p-4 rounded-xl text-white"
            >
              <h3 className="mb-3 font-semibold">{model}</h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histData}>
                    <XAxis dataKey="bin" />
                    <YAxis />
                    <Tooltip />

                    {/* 🔵 Class 0 */}
                    <Bar
                      dataKey="class0"
                      name="Actual 0"
                      fill="#60a5fa"
                    />

                    {/* 🔴 Class 1 */}
                    <Bar
                      dataKey="class1"
                      name="Actual 1"
                      fill="#f87171"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}