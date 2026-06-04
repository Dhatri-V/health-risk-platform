import { useState } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AssessmentPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const COLORS = [
    "#06b6d4",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
  ];

  const labels = {
    Pregnancies: "Pregnancy History",
    Glucose: "Blood Glucose",
    BloodPressure: "Blood Pressure",
    SkinThickness: "Skin Thickness",
    Insulin: "Insulin Level",
    BMI: "Body Mass Index",
    DiabetesPedigreeFunction: "Genetic Risk Score",
    Age: "Age",
  };

  const [formData, setFormData] = useState({
    Pregnancies: 2,
    Glucose: 180,
    BloodPressure: 80,
    SkinThickness: 30,
    Insulin: 150,
    BMI: 35.5,
    DiabetesPedigreeFunction: 0.5,
    Age: 50,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handlePredict = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8001/predict",
        formData
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Prediction Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white p-10">
        <div className="fixed top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-[120px] rounded-full"></div>

<div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[120px] rounded-full"></div>
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm mb-6">
  AI-Powered Healthcare Intelligence
</div>

<h1 className="text-7xl font-black tracking-tight">
  HealthTwin AI
</h1>

          <p className="text-slate-400 text-xl">
            Your Digital Health Twin powered by Explainable AI
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

          <div className="grid md:grid-cols-2 gap-6">

            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block mb-2 text-slate-300">
                  {labels[key]}
                </label>

                <input
                  type="number"
                  step="any"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700"
                />
              </div>
            ))}

          </div>

          <div className="text-center mt-10">

            <button
              onClick={handlePredict}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-10 py-4 rounded-2xl"
            >
              {loading
                ? "Analyzing..."
                : "Generate AI Report"}
            </button>

          </div>

          {result && (

            <div className="mt-12">

              <div className="bg-slate-950 border border-slate-700 rounded-3xl p-10 text-center">

                <h2
                  className={`text-4xl font-bold mb-4 ${
                    result.prediction === 1
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {result.risk}
                </h2>

                <div className="text-7xl font-bold text-cyan-400">
                  {result.confidence}%
                </div>

                <p className="text-slate-400 mt-2">
                  Health Risk Score
                </p>

                <div className="mt-6 w-full max-w-lg mx-auto">
                  <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-4 ${
                        result.prediction === 1
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${result.confidence}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href="http://127.0.0.1:8001/download-report"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-bold"
                  >
                    📄 Download PDF Report
                  </a>
                </div>

              </div>

              <div className="mt-10">

                <h2 className="text-3xl font-bold text-center mb-8">
                  Top Risk Factors
                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                  {result.top_factors?.map((factor, index) => (
                    <div
                      key={index}
                      className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
                    >
                      <div className="text-cyan-400 text-sm mb-2">
                        Factor #{index + 1}
                      </div>

                      <h3 className="text-2xl font-bold">
                        {factor.feature}
                      </h3>

                      <div className="text-red-400 text-4xl font-bold mt-4">
                        {factor.impact}
                      </div>

                    </div>
                  ))}

                </div>

              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                <h2 className="text-3xl font-bold mb-6">
                  AI Recommendations
                </h2>

                {result.prediction === 1 ? (

                  <div className="space-y-4">

                    <div className="bg-red-500/10 border border-red-500 rounded-xl p-4">
                      Reduce sugar and processed carbohydrate intake.
                    </div>

                    <div className="bg-red-500/10 border border-red-500 rounded-xl p-4">
                      Monitor fasting blood glucose levels weekly.
                    </div>

                    <div className="bg-red-500/10 border border-red-500 rounded-xl p-4">
                      Increase physical activity to at least 150 minutes per week.
                    </div>

                    <div className="bg-red-500/10 border border-red-500 rounded-xl p-4">
                      Consult a healthcare professional for further evaluation.
                    </div>

                  </div>

                ) : (

                  <div className="space-y-4">

                    <div className="bg-green-500/10 border border-green-500 rounded-xl p-4">
                      Continue maintaining a healthy lifestyle.
                    </div>

                    <div className="bg-green-500/10 border border-green-500 rounded-xl p-4">
                      Maintain regular physical activity.
                    </div>

                    <div className="bg-green-500/10 border border-green-500 rounded-xl p-4">
                      Continue annual preventive health screenings.
                    </div>

                  </div>

                )}

              </div>

              <div className="mt-10 bg-slate-950 border border-slate-700 rounded-3xl p-8">

                <h2 className="text-3xl font-bold text-center mb-8">
                  SHAP Risk Distribution
                </h2>

                <div style={{ width: "100%", height: 400 }}>

                  <ResponsiveContainer width="100%" height="100%">

                    <PieChart>

                      <Pie
                        data={result.top_factors}
                        dataKey="impact"
                        nameKey="feature"
                        outerRadius={130}
                        label
                      >
                        {result.top_factors?.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AssessmentPage;