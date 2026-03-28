import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
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
    <div className="h-96 bg-slate-900 p-4 rounded-xl shadow flex flex-col text-white">
  {/* Header - Stays at top */}
  <h2 className="text-lg font-semibold mb-2 shrink-0">
    ROC Curve Comparison
  </h2>

  {/* Chart Wrapper - Fills remaining space */}
  <div className="flex-1 min-h-0 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        
        <XAxis
          type="number"
          dataKey="FPR"
          domain={[0, 1]}
          stroke="#94a3b8"
          fontSize={11}
          tickFormatter={(val) => val.toFixed(1)}
          label={{ 
            value: "False Positive Rate", 
            position: "insideBottom", 
            offset: -12, 
            fill: "#94a3b8",
            fontSize: 12 
          }}
        />
        
        <YAxis
          type="number"
          dataKey="TPR"
          domain={[0, 1]}
          stroke="#94a3b8"
          fontSize={11}
          tickFormatter={(val) => val.toFixed(1)}
          label={{ 
            value: "True Positive Rate", 
            angle: -90, 
            position: "insideLeft", 
            offset: 10,
            fill: "#94a3b8",
            fontSize: 12 
          }}
        />

        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
          itemStyle={{ padding: '2px 0' }}
          formatter={(value) => (typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : value)}
        />
        
        {/* Mobile-friendly Legend: Moves to bottom, wraps text */}
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
          wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
        />

        {selectedModels.map((model: any, index: any) => {
          const modelData = rocData
            .filter((d) => d.Model === model)
            .sort((a, b) => a.FPR - b.FPR);

          // Simple color rotation if you don't have a color map
          const colors = ['#60a5fa', '#34d399', '#fbbf24', '#f87171'];
          
          return (
            <Line
              key={model}
              data={modelData}
              type="monotone"
              dataKey="TPR"
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              name={`${model} (${aucMap[model]?.toFixed(2)})`}
              dot={false}
              activeDot={{ r: 4 }}
            />
          );
        })}

        {/* Baseline */}
        <Line
          data={[
            { FPR: 0, TPR: 0 },
            { FPR: 1, TPR: 1 },
          ]}
          dataKey="TPR"
          stroke="#475569"
          strokeDasharray="5 5"
          strokeWidth={1}
          name="Random"
          dot={false}
          legendType="none" // Hide baseline from legend to save space
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
  );
}