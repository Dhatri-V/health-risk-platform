import { useState } from "react";
import axios from "axios";

function App() {
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

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

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
        "http://127.0.0.1:8000/predict",
        formData
      );

      setPrediction(response.data);
    } catch (error) {
      console.error(error);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold">
            Diabetes Risk Predictor
          </h1>

          <p className="text-slate-400 mt-3">
            Machine Learning Powered Healthcare Assessment
          </p>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label className="block mb-2 text-slate-300">
                  {key}
                </label>

                <input
                  type="number"
                  step="any"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handlePredict}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Predicting..." : "Predict Risk"}
            </button>
          </div>

          {prediction && (
            <div className="mt-10">
              <div className="text-center">
                <h2 className="text-4xl font-bold">
                  Prediction: {prediction.prediction}
                </h2>

                <div
                  className={`mt-4 inline-block px-6 py-3 rounded-full font-semibold ${
                    prediction.prediction === 1
                      ? "bg-red-600"
                      : "bg-green-600"
                  }`}
                >
                  {prediction.risk}
                </div>

                <p className="mt-5 text-xl text-slate-300">
                  Confidence: {prediction.confidence}%
                </p>

                <div className="mt-4 w-full max-w-md mx-auto bg-slate-700 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-4 ${
                      prediction.prediction === 1
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${prediction.confidence}%`,
                    }}
                  />
                </div>

                <div className="mt-6">
                  <a
                    href="http://127.0.0.1:8000/download-report"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold transition"
                  >
                    📄 Download Report
                  </a>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-2xl font-bold text-center mb-6">
                  Top Risk Factors
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  {prediction.top_factors?.map((factor, index) => (
                    <div
                      key={index}
                      className="bg-slate-800 rounded-2xl p-5 border border-slate-700"
                    >
                      <div className="text-red-400 text-sm font-semibold mb-2">
                        #{index + 1} Contributor
                      </div>

                      <h4 className="text-xl font-bold">
                        {factor.feature}
                      </h4>

                      <p className="mt-3 text-slate-400">
                        Impact Score
                      </p>

                      <div className="text-3xl font-bold text-red-400 mt-2">
                        {factor.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 p-4 bg-yellow-500/10 border border-yellow-500 rounded-xl text-yellow-300 text-center">
                Educational Risk Assessment Tool — Not Medical Advice
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;