import cmData from "../data/confusion_matrix.json";

type Props = {
  selectedModels: string[];
};

export default function ConfusionMatrix({ selectedModels }: Props) {

  // 🔥 Get unique models
  const models = [...new Set(cmData.map((d: any) => d.Model))];

  // 🔥 Filter based on dashboard selection
  const filteredModels = models.filter((m) =>
    selectedModels.includes(m)
  );

  // 🔥 Helper to get count
  const getCount = (
    model: string,
    actual: string,
    predicted: string
  ) => {
    const item = cmData.find(
      (d: any) =>
        d.Model === model &&
        d.Actual === actual &&
        d.Predicted === predicted
    );
    return item ? item.Count : 0;
  };

  // 🎨 Color intensity function
  const getColor = (value: number, max: number) => {
    const intensity = value / max;
    return `rgba(96,165,250,${intensity})`; // blue heat
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">
        Confusion Matrix
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredModels.map((model) => {
          // 🔥 Extract values
          const tn = getCount(model, "No_CHD", "No_CHD");
          const fp = getCount(model, "No_CHD", "CHD");
          const fn = getCount(model, "CHD", "No_CHD");
          const tp = getCount(model, "CHD", "CHD");

          const maxVal = Math.max(tn, fp, fn, tp);
          const accuracy = (tp + tn) / (tp + tn + fp + fn);

          return (
            <div
              key={model}
              className="bg-slate-900 p-4 rounded-xl text-white"
            >
              <h3 className="mb-3 font-semibold">{model}</h3>
              <p className="text-sm text-gray-400">
                Accuracy: {(accuracy * 100).toFixed(2)}%
              </p>
              {/* Matrix */}
              <div className="grid grid-cols-3 gap-2 text-center">

                {/* Header */}
                <div></div>
                <div>Predicted: No</div>
                <div>Predicted: Yes</div>

                {/* Row 1 */}
                <div>Actual: No</div>
                <div
                  style={{ background: getColor(tn, maxVal) }}
                  className="p-3 rounded flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-[10px] leading-none px-1 py-0.5 text-green-200 bg-cyan-950 rounded">
                    TN
                  </p>
                  <span className="font-bold">{tn}</span>
                </div>
                <div
                  style={{ background: getColor(fp, maxVal) }}
                  className="p-3 rounded flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-[10px] leading-none px-1 py-0.5 text-blue-200 bg-cyan-950 rounded">
                    FP
                  </p>
                  <span className="font-bold">{fp}</span>
                </div>

                {/* Row 2 */}
                <div>Actual: Yes</div>
                <div
                  style={{ background: getColor(fn, maxVal) }}
                  className="p-3 rounded flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-[10px] leading-none px-1 py-0.5 text-red-200 bg-cyan-950 rounded">
                    FN
                  </p>
                  <span className="font-bold">{fn}</span>
                </div>
                <div
                  style={{ background: getColor(tp, maxVal) }}
                  className="p-3 rounded flex flex-col items-center justify-center gap-1"
                >
                  <p className="text-[10px] leading-none px-1 py-0.5 text-yellow-200 bg-cyan-950 rounded">
                    TP
                  </p>
                  <span className="font-bold">{tp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}