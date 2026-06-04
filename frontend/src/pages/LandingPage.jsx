function LandingPage({ onStart }) {
  return (
    <div className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-8">

        <div className="min-h-screen flex flex-col items-center justify-center text-center">

          <div className="mb-8">

            <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500 text-cyan-400">
              AI Powered Preventive Healthcare
            </div>

          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-6">
            HealthTwin AI
          </h1>

          <p className="text-2xl text-slate-300 max-w-3xl">
            Predict health risks before symptoms appear using Explainable AI and personalized health intelligence.
          </p>

          <button
            onClick={onStart}
            className="mt-12 bg-cyan-500 hover:bg-cyan-400 text-black px-10 py-5 rounded-2xl text-xl font-bold transition"
          >
            Start Assessment →
          </button>

          <div className="grid md:grid-cols-3 gap-8 mt-24 w-full">

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-3">
                Explainable AI
              </h3>

              <p className="text-slate-400">
                Understand why the prediction was made using SHAP explainability.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-3">
                Digital Health Twin
              </h3>

              <p className="text-slate-400">
                Create a personalized digital representation of health risk.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-3">
                Automated Reports
              </h3>

              <p className="text-slate-400">
                Generate downloadable health assessment reports instantly.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LandingPage;