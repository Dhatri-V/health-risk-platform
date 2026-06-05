import { useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  LabelList,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function AssessmentPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [diseaseType, setDiseaseType] = useState("diabetes");
  const [currentHeartSection, setCurrentHeartSection] = useState(1);
  const [currentDiabetesSection, setCurrentDiabetesSection] = useState(1);
  const [diabetesUi, setDiabetesUi] = useState({
    gender: "female",
    heightCm: 170,
    weightKg: 80,
    familyHistory: "none",
    highBloodPressure: "no",
    elevatedBloodSugar: "no",
  });

  const COLORS = [
    "#06b6d4",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
  ];

  const GLASS_CARD =
    "bg-white/6 backdrop-blur-2xl border border-white/12 rounded-3xl shadow-[0_18px_60px_-30px_rgba(0,0,0,0.75)]";
  const GLASS_CARD_HOVER =
    "hover:border-white/25 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300";
  const CARD_SECTION_GAP = "mt-10";
  const PDF_BUTTON_CLASS =
    "inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-[0_22px_70px_-35px_rgba(34,197,94,0.55)] border border-white/10 hover:border-white/25 transition-all hover:-translate-y-0.5";

  // Diabetes labels
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

  // Heart disease labels
  // Heart disease friendly options and mappings
  const heartQuestionnaire = {
    section1: {
      title: "Personal Information",
      questions: [
        {
          id: "age",
          question: "What is your age?",
          helper: "Enter your current age in years",
          type: "number",
          min: 18,
          max: 120,
        },
        {
          id: "sex",
          question: "What is your gender?",
          helper: "Select your biological sex",
          type: "select",
          options: [
            { label: "Female", value: 0 },
            { label: "Male", value: 1 },
          ],
        },
      ],
    },
    section2: {
      title: "Medical History",
      questions: [
        {
          id: "trestbps",
          question: "What is your resting blood pressure (systolic)?",
          helper: "The higher number from your blood pressure reading (e.g., 120)",
          type: "number",
          min: 80,
          max: 200,
        },
        {
          id: "chol",
          question: "What is your cholesterol level?",
          helper: "Your total cholesterol in mg/dL",
          type: "number",
          min: 120,
          max: 400,
        },
        {
          id: "fbs",
          question: "Have you ever been told you have high blood sugar (fasting > 120)?",
          helper: "High fasting blood sugar may indicate prediabetes or diabetes",
          type: "select",
          options: [
            { label: "No", value: 0 },
            { label: "Yes", value: 1 },
          ],
        },
        {
          id: "restecg",
          question: "Have you ever had an abnormal ECG result?",
          helper: "An ECG measures your heart's electrical activity",
          type: "select",
          options: [
            { label: "No (Normal)", value: 0 },
            { label: "Yes (Abnormal)", value: 1 },
          ],
        },
      ],
    },
    section3: {
      title: "Symptoms & Exercise",
      questions: [
        {
          id: "cp",
          question: "How often do you experience chest pain or discomfort?",
          helper: "Chest pain can vary from mild pressure to severe pain",
          type: "select",
          options: [
            { label: "Never", value: 0 },
            { label: "Occasionally", value: 1 },
            { label: "During physical activity", value: 2 },
            { label: "Frequently", value: 3 },
          ],
        },
        {
          id: "exang",
          question: "Do you experience chest discomfort or pain during exercise?",
          helper: "Exercise-induced chest discomfort is a concern to discuss with your doctor",
          type: "select",
          options: [
            { label: "No", value: 0 },
            { label: "Yes", value: 1 },
          ],
        },
        {
          id: "thalach",
          question: "What is your maximum heart rate during exercise?",
          helper:
            "Typical values: Sedentary 100-130, Active 130-170, Athletes 170-200+. If unsure, choose a value close to your highest recorded exercise heart rate.",
          type: "select",
          options: [
            { label: "Mostly Sedentary", value: 100 },
            { label: "Light Exercise (1-2 times/week)", value: 120 },
            { label: "Moderate Exercise (3-4 times/week)", value: 140 },
            { label: "Regular Exercise (5+ times/week)", value: 160 },
            { label: "Athlete / Intense Training", value: 180 },
          ],
        },
      ],
    },
    section4: {
      title: "Heart Health Assessment",
      questions: [
        {
          id: "oldpeak",
          question: "How severe is your shortness of breath or exercise discomfort?",
          helper: "Rate on a scale: 0 = none, 6 = severe",
          type: "slider",
          min: 0,
          max: 6,
          step: 0.1,
        },
        {
          id: "slope",
          question: "How would you describe your exercise recovery?",
          helper: "How quickly your heart rate and breathing return to normal after exercise",
          type: "select",
          options: [
            { label: "Recovery is upsloping (good)", value: 0 },
            { label: "Recovery is flat (moderate)", value: 1 },
            { label: "Recovery is downsloping (poor)", value: 2 },
          ],
        },
        {
          id: "ca",
          question: "Have you been diagnosed with coronary artery blockage?",
          helper: "Based on imaging tests like angiography or CT scans",
          type: "select",
          options: [
            { label: "No", value: 0 },
            { label: "Mild blockage", value: 1 },
            { label: "Moderate blockage", value: 2 },
            { label: "Severe blockage", value: 3 },
          ],
        },
        {
          id: "thal",
          question: "Have you been diagnosed with a heart rhythm or blood flow abnormality?",
          helper: "Including thalassemia or other blood disorders affecting the heart",
          type: "select",
          options: [
            { label: "No", value: 0 },
            { label: "Mild", value: 1 },
            { label: "Moderate", value: 2 },
            { label: "Severe", value: 3 },
          ],
        },
      ],
    },
  };

  // Diabetes form data
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

  // Heart disease form data
  const [heartFormData, setHeartFormData] = useState({
    age: 55,
    sex: 1,
    cp: 0,
    trestbps: 140,
    chol: 250,
    fbs: 1,
    restecg: 1,
    thalach: 150,
    exang: 0,
    oldpeak: 2.3,
    slope: 2,
    ca: 0,
    thal: 2,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (diseaseType === "diabetes") {
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else {
      setHeartFormData({
        ...heartFormData,
        [name]: Number(value),
      });
    }
  };

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const getRiskTier = () => {
    if (!result) return "medium";
    const confidence = Number(result.confidence) || 0;
    if (result.prediction === 1) return confidence >= 70 ? "high" : "medium";
    return confidence <= 40 ? "low" : "medium";
  };

  const getTierStyles = (tier) => {
    if (tier === "low") {
      return {
        accentText: "text-green-300",
        accentBorder: "border-green-500/30",
        accentBg: "bg-green-500/10",
        shadow: "shadow-[0_28px_90px_-45px_rgba(34,197,94,0.70)]",
        progress: "bg-green-500",
        gradient: "from-green-900/30 to-emerald-900/30",
        glow: "shadow-[0_0_0_1px_rgba(34,197,94,0.18),0_30px_100px_-50px_rgba(34,197,94,0.75)]",
        leftBorder: "border-l-green-400/70",
      };
    }
    if (tier === "high") {
      return {
        accentText: "text-red-300",
        accentBorder: "border-red-500/30",
        accentBg: "bg-red-500/10",
        shadow: "shadow-[0_28px_90px_-45px_rgba(239,68,68,0.70)]",
        progress: "bg-red-500",
        gradient: "from-red-900/30 to-rose-900/30",
        glow: "shadow-[0_0_0_1px_rgba(239,68,68,0.18),0_30px_100px_-50px_rgba(239,68,68,0.75)]",
        leftBorder: "border-l-red-400/70",
      };
    }
    return {
      accentText: "text-amber-300",
      accentBorder: "border-amber-500/30",
      accentBg: "bg-amber-500/10",
      shadow: "shadow-[0_28px_90px_-45px_rgba(245,158,11,0.70)]",
      progress: "bg-amber-500",
      gradient: "from-amber-900/30 to-orange-900/30",
      glow: "shadow-[0_0_0_1px_rgba(245,158,11,0.18),0_30px_100px_-50px_rgba(245,158,11,0.75)]",
      leftBorder: "border-l-amber-400/70",
    };
  };

  const getTopFactorRankColors = (factors) => {
    const rankColors = ["#ef4444", "#f97316", "#facc15"];
    const remainder = ["#06b6d4", "#3b82f6", "#60a5fa", "#22c55e"];
    const sorted = [...(factors || [])].sort(
      (a, b) =>
        Math.abs(Number(b.impact) || 0) - Math.abs(Number(a.impact) || 0)
    );
    const colorByFeature = {};
    sorted.forEach((f, idx) => {
      const key = f?.feature ?? String(idx);
      colorByFeature[key] =
        idx < 3 ? rankColors[idx] : remainder[(idx - 3) % remainder.length];
    });
    return colorByFeature;
  };

  const bmiFromHeightWeight = (heightCm, weightKg) => {
    const h = Number(heightCm) / 100;
    if (!h || h <= 0) return 0;
    return Number(weightKg) / (h * h);
  };

  const getClinicalLabel = (tier) => {
    if (tier === "low") return "Healthy";
    if (tier === "high") return "High Risk";
    return "Borderline";
  };

  const getClinicalPillClasses = (tier) => {
    const styles = getTierStyles(tier);
    return `${styles.accentBg} ${styles.accentText} border ${styles.accentBorder}`;
  };

  const getAgeGroup = (age) => {
    const n = Number(age) || 0;
    if (n < 30) return "Young Adult";
    if (n < 45) return "Adult";
    if (n < 60) return "Middle Age";
    if (n < 75) return "Senior";
    return "Elderly";
  };

  const getBmiCategory = (bmi) => {
    const n = Number(bmi) || 0;
    if (n <= 0) return "Unknown";
    if (n < 18.5) return "Underweight";
    if (n < 25) return "Normal";
    if (n < 30) return "Overweight";
    if (n < 35) return "Obese (Class I)";
    if (n < 40) return "Obese (Class II)";
    return "Severe Obesity (Class III)";
  };

  const getSystolicBpCategory = (systolic) => {
    const n = Number(systolic) || 0;
    if (n <= 0) return "Unknown";
    if (n < 120) return "Normal";
    if (n < 130) return "Elevated";
    if (n < 140) return "Stage 1 Hypertension";
    if (n < 180) return "Stage 2 Hypertension";
    return "Hypertensive Crisis";
  };

  const getDiastolicBpCategory = (diastolic) => {
    const n = Number(diastolic) || 0;
    if (n <= 0) return "Unknown";
    if (n < 80) return "Normal";
    if (n < 90) return "Stage 1 Hypertension";
    if (n < 120) return "Stage 2 Hypertension";
    return "Hypertensive Crisis";
  };

  const getGlucoseStatus = (glucose) => {
    const n = Number(glucose) || 0;
    if (n <= 0) return "Unknown";
    if (n < 100) return "Normal Glucose";
    if (n < 126) return "Prediabetes Range";
    return "High Glucose";
  };

  const getCholesterolStatus = (chol) => {
    const n = Number(chol) || 0;
    if (n <= 0) return "Unknown";
    if (n < 200) return "Desirable";
    if (n < 240) return "Borderline High";
    return "High";
  };

  const getExerciseCapacityLabel = (maxHr) => {
    const n = Number(maxHr) || 0;
    if (n <= 0) return "Unknown";
    if (n < 120) return "Below Average";
    if (n < 150) return "Average";
    if (n < 170) return "Above Average";
    return "Excellent";
  };

  const getIndexColor = (score) => {
    const n = Number(score) || 0;
    if (n >= 75) return "text-green-300";
    if (n >= 50) return "text-amber-300";
    return "text-red-300";
  };

  const calcMetabolicHealthIndex = () => {
    const glucose = Number(formData.Glucose) || 0;
    const bmi = Number(formData.BMI) || 0;
    const bp = Number(formData.BloodPressure) || 0; // diastolic proxy in this UI
    const age = Number(formData.Age) || 0;

    const glucosePenalty = glucose <= 0 ? 20 : glucose < 100 ? 0 : glucose < 126 ? 12 : 25;
    const bmiPenalty = bmi <= 0 ? 15 : bmi < 25 ? 0 : bmi < 30 ? 10 : bmi < 35 ? 18 : 25;
    const bpPenalty = bp <= 0 ? 10 : bp < 80 ? 0 : bp < 90 ? 8 : bp < 120 ? 15 : 25;
    const agePenalty = age <= 0 ? 10 : age < 45 ? 0 : age < 60 ? 8 : age < 75 ? 15 : 22;

    return clamp(100 - (glucosePenalty + bmiPenalty + bpPenalty + agePenalty), 0, 100);
  };

  const calcCardioHealthIndex = () => {
    const age = Number(heartFormData.age) || 0;
    const bp = Number(heartFormData.trestbps) || 0;
    const chol = Number(heartFormData.chol) || 0;
    const maxHr = Number(heartFormData.thalach) || 0;
    const oldpeak = Number(heartFormData.oldpeak) || 0;

    const bpPenalty = bp <= 0 ? 18 : bp < 120 ? 0 : bp < 130 ? 8 : bp < 140 ? 14 : bp < 180 ? 22 : 30;
    const cholPenalty = chol <= 0 ? 16 : chol < 200 ? 0 : chol < 240 ? 10 : 20;
    const hrPenalty = maxHr <= 0 ? 12 : maxHr >= 160 ? 0 : maxHr >= 140 ? 6 : maxHr >= 120 ? 12 : 20;
    const agePenalty = age <= 0 ? 12 : age < 45 ? 0 : age < 60 ? 8 : age < 75 ? 14 : 20;
    const oldpeakPenalty = oldpeak <= 0 ? 0 : oldpeak < 1 ? 4 : oldpeak < 2 ? 10 : oldpeak < 4 ? 18 : 25;

    return clamp(100 - (bpPenalty + cholPenalty + hrPenalty + agePenalty + oldpeakPenalty), 0, 100);
  };

  const setDiabetesUiField = (field, value) => {
    const nextUi = { ...diabetesUi, [field]: value };
    setDiabetesUi(nextUi);

    // Keep backend payload unchanged, but map questionnaire answers to existing diabetes model fields.
    const nextForm = { ...formData };

    const bmi = bmiFromHeightWeight(nextUi.heightCm, nextUi.weightKg);
    if (Number.isFinite(bmi) && bmi > 0) {
      nextForm.BMI = Number(bmi.toFixed(1));
      nextForm.SkinThickness =
        bmi < 25 ? 20 : bmi < 30 ? 25 : bmi < 35 ? 30 : 35;
    }

    const dpfMap = { none: 0.2, parent: 0.5, sibling: 0.8, multiple: 1.0 };
    nextForm.DiabetesPedigreeFunction =
      dpfMap[nextUi.familyHistory] ?? nextForm.DiabetesPedigreeFunction;

    nextForm.BloodPressure = nextUi.highBloodPressure === "yes" ? 85 : 70;

    if (nextUi.gender !== "female") nextForm.Pregnancies = 0;

    if (
      nextUi.elevatedBloodSugar === "yes" &&
      (!nextForm.Glucose || nextForm.Glucose < 90)
    ) {
      nextForm.Glucose = 140;
    }

    setFormData(nextForm);
  };

  const nextDiabetesSection = () => {
    if (currentDiabetesSection < 4) {
      setCurrentDiabetesSection(currentDiabetesSection + 1);
    }
  };

  const prevDiabetesSection = () => {
    if (currentDiabetesSection > 1) {
      setCurrentDiabetesSection(currentDiabetesSection - 1);
    }
  };

  const handleHeartQuestionChange = (fieldId, value) => {
    setHeartFormData({
      ...heartFormData,
      [fieldId]: Number(value),
    });
  };

  const nextHeartSection = () => {
    if (currentHeartSection < 4) {
      setCurrentHeartSection(currentHeartSection + 1);
    }
  };

  const prevHeartSection = () => {
    if (currentHeartSection > 1) {
      setCurrentHeartSection(currentHeartSection - 1);
    }
  };

  const handlePredict = async () => {
    try {
      setLoading(true);

      const endpoint =
        diseaseType === "diabetes"
          ? "/predict"
          : "/predict-heart";

      const dataToSend =
        diseaseType === "diabetes" ? formData : heartFormData;

      console.log(`Sending ${diseaseType} prediction to ${endpoint}:`, dataToSend);

      const response = await axios.post(

`https://health-risk-platform.onrender.com${endpoint}`    ,    dataToSend
      );

      console.log("Prediction response:", response.data);
      setResult(response.data);
    } catch (error) {
      console.error("Prediction Error:", error);
      console.log("Error response data:", error.response?.data);
      console.log("Error status:", error.response?.status);
      console.log("Error message:", error.message);
      alert(`Prediction Failed: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdfReport = () => {
    console.log("[PDF] Download clicked", {
      diseaseType,
      resultRisk: result?.risk,
      resultConfidence: result?.confidence,
      hasTopFactors: Boolean(result?.top_factors?.length),
    });

    if (diseaseType === "diabetes") {
      console.log("[PDF] Using backend /download-report (diabetes template)");
window.open(

  "https://health-risk-platform.onrender.com/download-report",

  "_blank",

  "noopener,noreferrer"

);      return;
    }

    // Backend currently generates only the diabetes PDF (see /download-report).
    // For heart disease, use browser print-to-PDF so the correct heart report is captured.
    console.log("[PDF] Using print-to-PDF for heart disease (backend endpoint is diabetes-only)");
    window.print();
  };

  const renderPdfDownloadButton = () => (
    <button type="button" onClick={handleDownloadPdfReport} className={PDF_BUTTON_CLASS}>
      <span>📄</span>
      <span>Download PDF Report</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white p-10">
      <style>{`
        @media print {
          body { background: #fff !important; }
          body * { visibility: hidden !important; }
          #print-report, #print-report * { visibility: visible !important; }
          #print-report { position: absolute; left: 0; top: 0; width: 100%; color: #0f172a !important; }
          #print-report * { color: #0f172a !important; }
          #print-report .print-card {
            border: 1px solid #e2e8f0 !important;
            background: #ffffff !important;
            box-shadow: none !important;
          }
          #print-report a, #print-report button { display: none !important; }
        }
      `}</style>
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

        <div className={`${GLASS_CARD} p-8 ${GLASS_CARD_HOVER}`}>
          <div className="mb-8">
            <label className="block mb-2 text-slate-300">
              Select Assessment
            </label>

            <select
              value={diseaseType}
              onChange={(e) => {
                setDiseaseType(e.target.value);
                setCurrentHeartSection(1);
                setResult(null);
              }}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white"
            >
              <option value="diabetes">Diabetes Risk Assessment</option>
              <option value="heart">Heart Disease Assessment</option>
            </select>
          </div>

          {diseaseType === "diabetes" ? (
            // DIABETES QUESTIONNAIRE
            <>
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <div className="text-cyan-300 text-sm font-semibold">
                    DIABETES ASSESSMENT
                  </div>
                  <div className="text-2xl font-bold">
                    Step {currentDiabetesSection} of 4
                  </div>
                  <div className="text-slate-400">
                    {currentDiabetesSection === 1
                      ? "Personal Information"
                      : currentDiabetesSection === 2
                        ? "Body Metrics"
                        : currentDiabetesSection === 3
                          ? "Medical History"
                          : "Blood Test Information"}
                  </div>
                </div>

                <div className="hidden md:block w-56">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-cyan-500"
                      style={{
                        width: `${(currentDiabetesSection / 4) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {currentDiabetesSection === 1 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                    <label className="block text-lg font-semibold text-white mb-2">
                      {labels.Age}
                    </label>
                    <p className="text-sm text-slate-400 mb-4">
                      Enter your current age in years
                    </p>
                    <input
                      type="number"
                      min={18}
                      max={120}
                      name="Age"
                      value={formData.Age}
                      onChange={handleChange}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                    <label className="block text-lg font-semibold text-white mb-2">
                      Gender
                    </label>
                    <p className="text-sm text-slate-400 mb-4">
                      Used only to tailor questions (payload unchanged)
                    </p>
                    <select
                      value={diabetesUi.gender}
                      onChange={(e) =>
                        setDiabetesUiField("gender", e.target.value)
                      }
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="other">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors md:col-span-2">
                    <label className="block text-lg font-semibold text-white mb-2">
                      {labels.Pregnancies}
                    </label>
                    <p className="text-sm text-slate-400 mb-4">
                      Number of pregnancies (set to 0 if not applicable)
                    </p>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      name="Pregnancies"
                      value={formData.Pregnancies}
                      disabled={diabetesUi.gender !== "female"}
                      onChange={handleChange}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              )}

              {currentDiabetesSection === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                    <label className="block text-lg font-semibold text-white mb-2">
                      Height (cm)
                    </label>
                    <p className="text-sm text-slate-400 mb-4">
                      Used to calculate BMI (payload unchanged)
                    </p>
                    <input
                      type="number"
                      min={120}
                      max={220}
                      value={diabetesUi.heightCm}
                      onChange={(e) =>
                        setDiabetesUiField(
                          "heightCm",
                          clamp(Number(e.target.value), 120, 220)
                        )
                      }
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                    <label className="block text-lg font-semibold text-white mb-2">
                      Weight (kg)
                    </label>
                    <p className="text-sm text-slate-400 mb-4">
                      Used to calculate BMI
                    </p>
                    <input
                      type="number"
                      min={30}
                      max={250}
                      value={diabetesUi.weightKg}
                      onChange={(e) =>
                        setDiabetesUiField(
                          "weightKg",
                          clamp(Number(e.target.value), 30, 250)
                        )
                      }
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-cyan-500/30 rounded-3xl p-8 shadow-[0_20px_60px_-25px_rgba(6,182,212,0.55)]">
                    <div className="text-cyan-300 text-sm font-semibold mb-2">
                      BMI (AUTO-CALCULATED)
                    </div>
                    <div className="text-6xl font-bold text-white mb-2">
                      {formData.BMI}
                    </div>
                    <div className="text-slate-400">
                      Calculated from your height and weight
                    </div>
                  </div>
                </div>
              )}

              {currentDiabetesSection === 3 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                    <label className="block text-lg font-semibold text-white mb-2">
                      Family history of diabetes
                    </label>
                    <p className="text-sm text-slate-400 mb-4">
                      Maps to the model’s genetic risk score field
                    </p>
                    <select
                      value={diabetesUi.familyHistory}
                      onChange={(e) =>
                        setDiabetesUiField("familyHistory", e.target.value)
                      }
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      <option value="none">None known</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="multiple">Multiple relatives</option>
                    </select>
                  </div>

                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                    <label className="block text-lg font-semibold text-white mb-2">
                      High blood pressure
                    </label>
                    <p className="text-sm text-slate-400 mb-4">
                      Maps to the model’s blood pressure field
                    </p>
                    <select
                      value={diabetesUi.highBloodPressure}
                      onChange={(e) =>
                        setDiabetesUiField("highBloodPressure", e.target.value)
                      }
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                    <label className="block text-lg font-semibold text-white mb-2">
                      Previous elevated blood sugar
                    </label>
                    <p className="text-sm text-slate-400 mb-4">
                      Helps suggest glucose defaults (payload unchanged)
                    </p>
                    <select
                      value={diabetesUi.elevatedBloodSugar}
                      onChange={(e) =>
                        setDiabetesUiField("elevatedBloodSugar", e.target.value)
                      }
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>
              )}

              {currentDiabetesSection === 4 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                    <label className="block text-lg font-semibold text-white mb-2">
                      {labels.Glucose}
                    </label>
                    <p className="text-sm text-slate-400 mb-4">
                      Enter your glucose value
                    </p>
                    <input
                      type="number"
                      min={50}
                      max={300}
                      name="Glucose"
                      value={formData.Glucose}
                      onChange={handleChange}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                    <label className="block text-lg font-semibold text-white mb-2">
                      {labels.Insulin}
                    </label>
                    <p className="text-sm text-slate-400 mb-4">
                      Enter your insulin value
                    </p>
                    <input
                      type="number"
                      min={0}
                      max={900}
                      name="Insulin"
                      value={formData.Insulin}
                      onChange={handleChange}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      onClick={handlePredict}
                      className="w-full px-6 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-colors shadow-[0_20px_60px_-25px_rgba(6,182,212,0.55)]"
                    >
                      {loading ? "Analyzing..." : "Generate AI Report"}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-10">
                <button
                  onClick={prevDiabetesSection}
                  disabled={currentDiabetesSection === 1}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                {currentDiabetesSection < 4 ? (
                  <button
                    onClick={nextDiabetesSection}
                    className="flex-1 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors shadow-[0_20px_60px_-25px_rgba(6,182,212,0.55)]"
                  >
                    Next →
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            // HEART DISEASE QUESTIONNAIRE
            <>
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">
                    {heartQuestionnaire[`section${currentHeartSection}`].title}
                  </h2>
                  <div className="text-sm text-slate-400">
                    Step {currentHeartSection} of 4
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-cyan-500 transition-all duration-300"
                    style={{ width: `${(currentHeartSection / 4) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Questions Cards */}
              <div className="space-y-6">
                {heartQuestionnaire[`section${currentHeartSection}`].questions.map(
                  (q) => (
                    <div
                      key={q.id}
                      className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors"
                    >
                      <label className="block text-lg font-semibold text-white mb-2">
                        {q.question}
                      </label>
                      <p className="text-sm text-slate-400 mb-4">{q.helper}</p>

                      {q.type === "number" && (
                        <input
                          type="number"
                          min={q.min}
                          max={q.max}
                          name={q.id}
                          value={heartFormData[q.id]}
                          onChange={(e) =>
                            handleHeartQuestionChange(q.id, e.target.value)
                          }
                          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                        />
                      )}

                      {q.type === "select" && (
                        <select
                          name={q.id}
                          value={heartFormData[q.id]}
                          onChange={(e) =>
                            handleHeartQuestionChange(q.id, e.target.value)
                          }
                          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                        >
                          {q.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {q.type === "slider" && (
                        <div className="space-y-3">
                          <input
                            type="range"
                            min={q.min}
                            max={q.max}
                            step={q.step || 1}
                            name={q.id}
                            value={heartFormData[q.id]}
                            onChange={(e) =>
                              handleHeartQuestionChange(q.id, e.target.value)
                            }
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />
                          <div className="flex justify-between text-sm text-slate-400">
                            <span>{q.min}</span>
                            <span className="text-white font-semibold">
                              {heartFormData[q.id]}
                            </span>
                            <span>{q.max}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-10">
                <button
                  onClick={prevHeartSection}
                  disabled={currentHeartSection === 1}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-600 text-white font-semibold hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>

                {currentHeartSection < 4 ? (
                  <button
                    onClick={nextHeartSection}
                    className="flex-1 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handlePredict}
                    className="flex-1 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors"
                  >
                    {loading ? "Analyzing..." : "Generate AI Report"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {result && (
          <div id="print-report" className="mt-12">
            {(() => {
              const tier = getRiskTier();
              const tierStyles = getTierStyles(tier);
              const clinicalLabel = getClinicalLabel(tier);
              const factors = result.top_factors || [];
              const fallbackHeartFactors = [
                { feature: "Age", impact: heartFormData.age / 100 },
                { feature: "Blood Pressure", impact: heartFormData.trestbps / 200 },
                { feature: "Cholesterol", impact: heartFormData.chol / 400 },
                { feature: "Max Heart Rate", impact: (220 - heartFormData.thalach) / 220 },
                { feature: "ST Depression", impact: (heartFormData.oldpeak || 0) / 6 },
              ];
              const activeFactors =
                diseaseType === "heart" && (!factors || factors.length === 0)
                  ? fallbackHeartFactors
                  : factors;
              const factorColors = getTopFactorRankColors(activeFactors);
              const factorsChart = activeFactors.map((f) => ({
                factor: f.feature,
                impact: Number(f.impact) || 0,
              }));
              const pieData = activeFactors.map((f) => ({
                feature: f.feature,
                value: Math.abs(Number(f.impact) || 0),
              }));
              const metabolicIndex = calcMetabolicHealthIndex();
              const cardioIndex = calcCardioHealthIndex();

              return diseaseType === "diabetes" ? (
              // DIABETES REPORT
              <>
                <div
                  className={`${GLASS_CARD} ${tierStyles.glow} p-10 text-center ${GLASS_CARD_HOVER}`}
                >
                  <h2
                    className={`text-4xl font-bold mb-4 ${
                      result.prediction === 1
                        ? tierStyles.accentText
                        : tierStyles.accentText
                    }`}
                  >
                    {result.risk}
                  </h2>

                  <div className="text-8xl font-black tracking-tight text-white">
                    {result.confidence}%
                  </div>

                  <p className="text-slate-300/80 mt-2 text-lg">
                    Diabetes Risk Score
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <div
                      className={`px-4 py-2 rounded-full text-xs font-black tracking-wide uppercase ${getClinicalPillClasses(
                        tier
                      )}`}
                    >
                      Clinical Status: {clinicalLabel}
                    </div>
                  </div>

                  <div className="mt-6 w-full max-w-lg mx-auto">
                    <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-4 ${tierStyles.progress}`}
                        style={{
                          width: `${result.confidence}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    {result.top_factors && (
                      renderPdfDownloadButton()
                    )}
                  </div>
                </div>

                <div className={`${CARD_SECTION_GAP} grid md:grid-cols-3 gap-6`}>
                  <div
                    className={`${GLASS_CARD} ${tierStyles.shadow} bg-gradient-to-br ${tierStyles.gradient} border ${tierStyles.accentBorder} p-8 ${GLASS_CARD_HOVER}`}
                  >
                    <div className="text-slate-300 text-sm font-semibold mb-2">
                      METABOLIC HEALTH INDEX
                    </div>
                    <div className={`text-7xl font-black tracking-tight mb-2 ${getIndexColor(metabolicIndex)}`}>
                      {Math.round(metabolicIndex)}
                    </div>
                    <div className="text-slate-400 text-sm">
                      Composite index derived from glucose, BMI, blood pressure, and age
                    </div>
                  </div>

                  <div
                    className={`${GLASS_CARD} shadow-[0_28px_90px_-45px_rgba(234,179,8,0.55)] bg-gradient-to-br from-amber-900/25 to-orange-900/20 border border-amber-500/25 p-8 ${GLASS_CARD_HOVER}`}
                  >
                    <div className="text-amber-300 text-sm font-semibold mb-2">
                      GLUCOSE STATUS
                    </div>
                    <div className="text-3xl md:text-4xl font-black tracking-tight text-white">
                      {getGlucoseStatus(formData.Glucose)}
                    </div>
                    <div className="mt-3 text-slate-400 text-sm">
                      Glucose: <span className="text-slate-200 font-semibold">{formData.Glucose}</span>
                    </div>
                  </div>

                  <div
                    className={`${GLASS_CARD} shadow-[0_28px_90px_-45px_rgba(59,130,246,0.55)] bg-gradient-to-br from-slate-950/40 to-slate-900/30 border border-white/10 p-8 ${GLASS_CARD_HOVER}`}
                  >
                    <div className="text-slate-300 text-sm font-semibold mb-2">
                      KEY BIOMARKER SUMMARY
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-white/6 border border-white/10 rounded-2xl p-4">
                        <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                          BMI
                        </div>
                        <div className="text-lg font-black text-white">
                          {formData.BMI}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getBmiCategory(formData.BMI)}
                        </div>
                      </div>
                      <div className="bg-white/6 border border-white/10 rounded-2xl p-4">
                        <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                          BP
                        </div>
                        <div className="text-lg font-black text-white">
                          {formData.BloodPressure}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getDiastolicBpCategory(formData.BloodPressure)}
                        </div>
                      </div>
                      <div className="bg-white/6 border border-white/10 rounded-2xl p-4">
                        <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                          Age
                        </div>
                        <div className="text-lg font-black text-white">
                          {formData.Age}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getAgeGroup(formData.Age)}
                        </div>
                      </div>
                      <div className="bg-white/6 border border-white/10 rounded-2xl p-4">
                        <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                          Glucose
                        </div>
                        <div className="text-lg font-black text-white">
                          {formData.Glucose}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getGlucoseStatus(formData.Glucose)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${CARD_SECTION_GAP} ${GLASS_CARD} p-8 ${GLASS_CARD_HOVER}`}>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="text-2xl md:text-3xl font-black tracking-tight text-white">
                      Personal Information
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getClinicalPillClasses(
                        tier
                      )}`}
                    >
                      {clinicalLabel}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-white/6 border border-white/10 rounded-2xl p-5">
                      <div className="text-slate-400 text-xs uppercase tracking-wider">
                        Age
                      </div>
                      <div className="text-2xl font-black text-white">
                        {formData.Age}
                      </div>
                      <div className="text-sm text-slate-400">
                        {getAgeGroup(formData.Age)}
                      </div>
                    </div>
                    <div className="bg-white/6 border border-white/10 rounded-2xl p-5">
                      <div className="text-slate-400 text-xs uppercase tracking-wider">
                        BMI
                      </div>
                      <div className="text-2xl font-black text-white">
                        {formData.BMI}
                      </div>
                      <div className="text-sm text-slate-400">
                        {getBmiCategory(formData.BMI)}
                      </div>
                    </div>
                    <div className="bg-white/6 border border-white/10 rounded-2xl p-5">
                      <div className="text-slate-400 text-xs uppercase tracking-wider">
                        Glucose
                      </div>
                      <div className="text-2xl font-black text-white">
                        {formData.Glucose}
                      </div>
                      <div className="text-sm text-slate-400">
                        {getGlucoseStatus(formData.Glucose)}
                      </div>
                    </div>
                    <div className="bg-white/6 border border-white/10 rounded-2xl p-5">
                      <div className="text-slate-400 text-xs uppercase tracking-wider">
                        Blood Pressure
                      </div>
                      <div className="text-2xl font-black text-white">
                        {formData.BloodPressure}
                      </div>
                      <div className="text-sm text-slate-400">
                        {getDiastolicBpCategory(formData.BloodPressure)}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`${CARD_SECTION_GAP} ${GLASS_CARD} border-l-4 ${tierStyles.leftBorder} p-8 ${GLASS_CARD_HOVER}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-2xl ${tierStyles.accentBg} border ${tierStyles.accentBorder} flex items-center justify-center`}
                    >
                      <span className="text-lg">💡</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                      AI Health Summary
                    </h2>
                  </div>
                  <p className="text-slate-200/90 leading-relaxed text-lg md:text-xl">
                    {result.prediction === 1
                      ? "Your assessment indicates elevated diabetes risk. Key drivers commonly include higher glucose levels, elevated BMI, age-related metabolic changes, and other metabolic indicators that may affect insulin sensitivity. Consider discussing these findings with a healthcare professional for confirmatory testing and a personalized prevention plan."
                      : "Your assessment indicates a lower diabetes risk based on your current profile. Glucose- and metabolism-related indicators appear more favorable overall. Maintain healthy habits like balanced nutrition, regular physical activity, and routine checkups to keep your risk low over time."}
                  </p>
                </div>

                <div className={`${CARD_SECTION_GAP} ${GLASS_CARD} p-8 ${GLASS_CARD_HOVER}`}>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                      AI Recommendations
                    </h2>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${tierStyles.accentBg} ${tierStyles.accentText} border ${tierStyles.accentBorder}`}
                    >
                      Personalized
                    </div>
                  </div>

                  {result.prediction === 1 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="group bg-white/6 border border-red-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(239,68,68,0.55)] hover:border-red-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-red-500/12 border border-red-500/30 flex items-center justify-center">
                            <span className="text-lg">🥗</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Nutrition
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Reduce sugar and processed carbohydrate intake.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-red-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(239,68,68,0.55)] hover:border-red-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-red-500/12 border border-red-500/30 flex items-center justify-center">
                            <span className="text-lg">🧪</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Monitoring
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Monitor fasting blood glucose levels weekly.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-red-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(239,68,68,0.55)] hover:border-red-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-red-500/12 border border-red-500/30 flex items-center justify-center">
                            <span className="text-lg">🏃‍♂️</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Activity
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Increase physical activity to at least 150 minutes
                              per week.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-red-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(239,68,68,0.55)] hover:border-red-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-red-500/12 border border-red-500/30 flex items-center justify-center">
                            <span className="text-lg">👩‍⚕️</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Next Steps
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Consult a healthcare professional for further
                              evaluation.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="group bg-white/6 border border-green-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(34,197,94,0.55)] hover:border-green-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-green-500/12 border border-green-500/30 flex items-center justify-center">
                            <span className="text-lg">✅</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Lifestyle
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Continue maintaining a healthy lifestyle.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-green-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(34,197,94,0.55)] hover:border-green-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-green-500/12 border border-green-500/30 flex items-center justify-center">
                            <span className="text-lg">🏃</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Activity
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Maintain regular physical activity.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-green-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(34,197,94,0.55)] hover:border-green-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300 md:col-span-2">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-green-500/12 border border-green-500/30 flex items-center justify-center">
                            <span className="text-lg">🩺</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Prevention
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Continue annual preventive health screenings.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {result.top_factors && (
                  <div className="mt-10">
                    <h2 className="text-3xl font-bold text-center mb-8">
                      Top Risk Factors
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                      {result.top_factors?.map((factor, index) => (
                        <div
                          key={index}
                          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-white/20 hover:-translate-y-0.5 transition-all"
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
                )}

                {result.top_factors && (
                  <div className={`${CARD_SECTION_GAP} ${GLASS_CARD} p-8 ${GLASS_CARD_HOVER}`}>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-2">
                      Risk Contribution Analysis
                    </h2>
                    <p className="text-center text-slate-400 mb-8">
                      How individual inputs contributed to the model’s risk estimate
                    </p>

                    <div className="bg-slate-950/40 border border-white/10 rounded-3xl p-4 md:p-6">
                    <div style={{ width: "100%", height: 360 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={factorsChart}
                          margin={{ top: 10, right: 25, bottom: 10, left: 0 }}
                        >
                          <CartesianGrid
                            stroke="rgba(255,255,255,0.08)"
                            strokeDasharray="3 3"
                          />
                          <XAxis
                            dataKey="factor"
                            label={{
                              value: "Factors",
                              position: "insideBottom",
                              offset: -5,
                              fill: "rgba(226,232,240,0.7)",
                            }}
                            tick={{
                              fill: "rgba(226,232,240,0.7)",
                              fontSize: 12,
                            }}
                            interval={0}
                            angle={-15}
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis
                            label={{
                              value: "Impact",
                              angle: -90,
                              position: "insideLeft",
                              fill: "rgba(226,232,240,0.7)",
                            }}
                            tick={{
                              fill: "rgba(226,232,240,0.7)",
                              fontSize: 12,
                            }}
                          />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="impact"
                            name="Contribution"
                            strokeWidth={3}
                            stroke="#06b6d4"
                            dot={{ r: 3 }}
                            activeDot={{ r: 6 }}
                            isAnimationActive
                            animationDuration={900}
                          >
                            <LabelList
                              dataKey="impact"
                              position="top"
                              fill="rgba(226,232,240,0.85)"
                              fontSize={12}
                            />
                          </Line>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    </div>

                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                      <div className="bg-slate-950/40 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className="text-slate-200 font-bold">
                            SHAP Analysis (Pie)
                          </div>
                          <div className="text-xs text-slate-400">
                            Top 3 are highlighted
                          </div>
                        </div>
                        <div style={{ width: "100%", height: 320 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Legend />
                              <Pie
                                data={factors || []}
                                dataKey="impact"
                                nameKey="feature"
                                outerRadius={120}
                                labelLine={false}
                                label={({ name, value }) =>
                                  `${name}: ${Number(value).toFixed(2)}`
                                }
                                isAnimationActive
                                animationDuration={850}
                              >
                                {(factors || [])?.map((entry, index) => (
                                  <Cell
                                    key={index}
                                    fill={
                                      factorColors[entry.feature] ??
                                      COLORS[index % COLORS.length]
                                    }
                                  />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-slate-950/40 border border-white/10 rounded-3xl p-6">
                        <div className="text-slate-200 font-bold mb-2">
                          Notes
                        </div>
                        <div className="text-slate-400 text-sm leading-relaxed">
                          Highest impact factors are color-coded to stand out.
                          Values are shown directly on the chart for quick
                          review, and you can still hover for details.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // HEART DISEASE REPORT
              <>
                <div
                  className={`${GLASS_CARD} ${tierStyles.glow} p-10 text-center ${GLASS_CARD_HOVER}`}
                >
                  <h2
                    className={`text-4xl font-bold mb-4 ${
                      result.prediction === 1
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {result.risk}
                  </h2>

                  <div className="text-8xl font-black tracking-tight text-white">
                    {result.confidence}%
                  </div>

                  <p className="text-slate-300/80 mt-2 text-lg">
                    Cardiovascular Risk Score
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-3">
                    <div
                      className={`px-4 py-2 rounded-full text-xs font-black tracking-wide uppercase ${getClinicalPillClasses(
                        tier
                      )}`}
                    >
                      Clinical Status: {clinicalLabel}
                    </div>
                  </div>

                  <div className="mt-6 w-full max-w-lg mx-auto">
                    <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-4 ${tierStyles.progress}`}
                        style={{
                          width: `${result.confidence}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    {renderPdfDownloadButton()}
                  </div>
                </div>

                <div className={`${CARD_SECTION_GAP} grid md:grid-cols-3 gap-6`}>
                  <div className={`${GLASS_CARD} ${tierStyles.shadow} bg-gradient-to-br ${tierStyles.gradient} border ${tierStyles.accentBorder} p-8 ${GLASS_CARD_HOVER}`}>
                    <div className="text-slate-300 text-sm font-semibold mb-2">
                      CARDIOVASCULAR HEALTH INDEX
                    </div>
                    <div className={`text-7xl font-black tracking-tight mb-2 ${getIndexColor(cardioIndex)}`}>
                      {Math.round(cardioIndex)}
                    </div>
                    <div className="text-slate-400 text-sm">
                      Composite index derived from BP, cholesterol, exercise capacity, age, and ST depression
                    </div>
                  </div>

                  <div className={`${GLASS_CARD} shadow-[0_28px_90px_-45px_rgba(234,179,8,0.55)] bg-gradient-to-br from-amber-900/25 to-orange-900/20 border border-amber-500/25 p-8 ${GLASS_CARD_HOVER}`}>
                    <div className="text-amber-300 text-sm font-semibold mb-2">
                      BLOOD PRESSURE CLASSIFICATION
                    </div>
                    <div className="text-3xl md:text-4xl font-black tracking-tight text-white">
                      {getSystolicBpCategory(heartFormData.trestbps)}
                    </div>
                    <div className="mt-3 text-slate-400 text-sm">
                      BP: <span className="text-slate-200 font-semibold">{heartFormData.trestbps}</span>
                    </div>
                  </div>

                  <div className={`${GLASS_CARD} shadow-[0_28px_90px_-45px_rgba(59,130,246,0.55)] bg-gradient-to-br from-slate-950/40 to-slate-900/30 border border-white/10 p-8 ${GLASS_CARD_HOVER}`}>
                    <div className="text-slate-300 text-sm font-semibold mb-2">
                      EXERCISE CAPACITY SUMMARY
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-white/6 border border-white/10 rounded-2xl p-4">
                        <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                          Max HR
                        </div>
                        <div className="text-lg font-black text-white">
                          {heartFormData.thalach}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getExerciseCapacityLabel(heartFormData.thalach)}
                        </div>
                      </div>
                      <div className="bg-white/6 border border-white/10 rounded-2xl p-4">
                        <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                          Cholesterol
                        </div>
                        <div className="text-lg font-black text-white">
                          {heartFormData.chol}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getCholesterolStatus(heartFormData.chol)}
                        </div>
                      </div>
                      <div className="bg-white/6 border border-white/10 rounded-2xl p-4">
                        <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                          Age
                        </div>
                        <div className="text-lg font-black text-white">
                          {heartFormData.age}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getAgeGroup(heartFormData.age)}
                        </div>
                      </div>
                      <div className="bg-white/6 border border-white/10 rounded-2xl p-4">
                        <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                          BP
                        </div>
                        <div className="text-lg font-black text-white">
                          {heartFormData.trestbps}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getSystolicBpCategory(heartFormData.trestbps)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${CARD_SECTION_GAP} ${GLASS_CARD} p-8 ${GLASS_CARD_HOVER}`}>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="text-2xl md:text-3xl font-black tracking-tight text-white">
                      Personal Information
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getClinicalPillClasses(
                        tier
                      )}`}
                    >
                      {clinicalLabel}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-white/6 border border-white/10 rounded-2xl p-5">
                      <div className="text-slate-400 text-xs uppercase tracking-wider">
                        Age
                      </div>
                      <div className="text-2xl font-black text-white">
                        {heartFormData.age}
                      </div>
                      <div className="text-sm text-slate-400">
                        {getAgeGroup(heartFormData.age)}
                      </div>
                    </div>
                    <div className="bg-white/6 border border-white/10 rounded-2xl p-5">
                      <div className="text-slate-400 text-xs uppercase tracking-wider">
                        Blood Pressure
                      </div>
                      <div className="text-2xl font-black text-white">
                        {heartFormData.trestbps}
                      </div>
                      <div className="text-sm text-slate-400">
                        {getSystolicBpCategory(heartFormData.trestbps)}
                      </div>
                    </div>
                    <div className="bg-white/6 border border-white/10 rounded-2xl p-5">
                      <div className="text-slate-400 text-xs uppercase tracking-wider">
                        Cholesterol
                      </div>
                      <div className="text-2xl font-black text-white">
                        {heartFormData.chol}
                      </div>
                      <div className="text-sm text-slate-400">
                        {getCholesterolStatus(heartFormData.chol)}
                      </div>
                    </div>
                    <div className="bg-white/6 border border-white/10 rounded-2xl p-5">
                      <div className="text-slate-400 text-xs uppercase tracking-wider">
                        Max Heart Rate
                      </div>
                      <div className="text-2xl font-black text-white">
                        {heartFormData.thalach}
                      </div>
                      <div className="text-sm text-slate-400">
                        {getExerciseCapacityLabel(heartFormData.thalach)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${CARD_SECTION_GAP} ${GLASS_CARD} border-l-4 ${tierStyles.leftBorder} p-8 ${GLASS_CARD_HOVER}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-2xl ${tierStyles.accentBg} border ${tierStyles.accentBorder} flex items-center justify-center`}
                    >
                      <span className="text-lg">💡</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                      AI Health Summary
                    </h2>
                  </div>
                  <p className="text-slate-200/90 leading-relaxed text-lg md:text-xl">
                    {result.prediction === 1
                      ? "Based on your responses, the model detected elevated cardiovascular risk. Key concerns include your chest pain patterns, blood pressure levels, and exercise-related symptoms. These indicators suggest increased coronary heart disease risk. We recommend consulting with a healthcare provider for a comprehensive cardiac evaluation and discuss preventive measures."
                      : "Based on your responses, your cardiovascular profile indicates lower risk for heart disease. Your blood pressure, cholesterol levels, and exercise tolerance appear within favorable ranges. Continue maintaining your current healthy lifestyle habits and regular health monitoring to sustain this positive health status."}
                  </p>
                </div>

                <div className={`${CARD_SECTION_GAP} ${GLASS_CARD} p-8 ${GLASS_CARD_HOVER}`}>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                      AI Recommendations
                    </h2>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${tierStyles.accentBg} ${tierStyles.accentText} border ${tierStyles.accentBorder}`}
                    >
                      Personalized
                    </div>
                  </div>

                  {result.prediction === 1 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="group bg-white/6 border border-red-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(239,68,68,0.55)] hover:border-red-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-red-500/12 border border-red-500/30 flex items-center justify-center">
                            <span className="text-lg">🫀</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Consult a Cardiologist
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Schedule an appointment with a cardiac specialist
                              for comprehensive evaluation.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-red-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(239,68,68,0.55)] hover:border-red-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-red-500/12 border border-red-500/30 flex items-center justify-center">
                            <span className="text-lg">🩸</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Monitor Blood Pressure
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Check blood pressure regularly and maintain a log.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-red-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(239,68,68,0.55)] hover:border-red-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-red-500/12 border border-red-500/30 flex items-center justify-center">
                            <span className="text-lg">🥑</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Reduce Saturated Fats
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Limit saturated fat intake and increase fiber-rich
                              foods.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-red-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(239,68,68,0.55)] hover:border-red-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-red-500/12 border border-red-500/30 flex items-center justify-center">
                            <span className="text-lg">🏃‍♀️</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Increase Physical Activity
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Aim for at least 150 minutes of moderate exercise
                              per week.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-red-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(239,68,68,0.55)] hover:border-red-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300 md:col-span-2">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-red-500/12 border border-red-500/30 flex items-center justify-center">
                            <span className="text-lg">⚖️</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Maintain Healthy Weight
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Work towards a BMI within the normal range.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="group bg-white/6 border border-green-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(34,197,94,0.55)] hover:border-green-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-green-500/12 border border-green-500/30 flex items-center justify-center">
                            <span className="text-lg">✅</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Continue Healthy Habits
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Maintain your current lifestyle practices.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-green-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(34,197,94,0.55)] hover:border-green-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-green-500/12 border border-green-500/30 flex items-center justify-center">
                            <span className="text-lg">🏃</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Maintain Regular Exercise
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Continue your exercise routine for cardiovascular
                              health.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-green-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(34,197,94,0.55)] hover:border-green-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-green-500/12 border border-green-500/30 flex items-center justify-center">
                            <span className="text-lg">🩺</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Routine Health Checkups
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Schedule annual comprehensive health screenings.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="group bg-white/6 border border-green-500/25 rounded-2xl p-5 shadow-[0_20px_60px_-35px_rgba(34,197,94,0.55)] hover:border-green-400/45 hover:bg-white/8 hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-green-500/12 border border-green-500/30 flex items-center justify-center">
                            <span className="text-lg">🩸</span>
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg">
                              Monitor Blood Pressure
                            </div>
                            <div className="text-slate-300/80 mt-1">
                              Check blood pressure annually and maintain
                              records.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`${CARD_SECTION_GAP} ${GLASS_CARD} p-8 ${GLASS_CARD_HOVER}`}>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-2">
                    Cardiovascular Risk Analysis
                  </h2>
                  <p className="text-center text-slate-400 mb-8">
                    Top contributing factors based on your responses
                  </p>

                  <div className="bg-slate-950/40 border border-white/10 rounded-3xl p-4 md:p-6">
                    <div style={{ width: "100%", height: 360 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={factorsChart}
                          margin={{ top: 10, right: 25, bottom: 10, left: 0 }}
                        >
                          <CartesianGrid
                            stroke="rgba(255,255,255,0.08)"
                            strokeDasharray="3 3"
                          />
                          <XAxis
                            dataKey="factor"
                            label={{
                              value: "Factors",
                              position: "insideBottom",
                              offset: -5,
                              fill: "rgba(226,232,240,0.7)",
                            }}
                            tick={{
                              fill: "rgba(226,232,240,0.7)",
                              fontSize: 12,
                            }}
                            interval={0}
                            angle={-15}
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis
                            label={{
                              value: "Impact",
                              angle: -90,
                              position: "insideLeft",
                              fill: "rgba(226,232,240,0.7)",
                            }}
                            tick={{
                              fill: "rgba(226,232,240,0.7)",
                              fontSize: 12,
                            }}
                          />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="impact"
                            name="Contribution"
                            strokeWidth={3}
                            stroke="#a855f7"
                            dot={{ r: 3 }}
                            activeDot={{ r: 6 }}
                            isAnimationActive
                            animationDuration={900}
                          >
                            <LabelList
                              dataKey="impact"
                              position="top"
                              fill="rgba(226,232,240,0.85)"
                              fontSize={12}
                            />
                          </Line>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-950/40 border border-white/10 rounded-3xl p-6">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="text-slate-200 font-bold">
                          Risk Factor Distribution
                        </div>
                        <div className="text-xs text-slate-400">
                          Percent contribution (relative)
                        </div>
                      </div>

                      <div style={{ width: "100%", height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Legend />
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="feature"
                              outerRadius={120}
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                              isAnimationActive
                              animationDuration={850}
                            >
                              {(pieData || []).map((entry, index) => (
                                <Cell
                                  key={index}
                                  fill={
                                    factorColors[entry.feature] ??
                                    COLORS[index % COLORS.length]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 border border-white/10 rounded-3xl p-6">
                      <div className="text-slate-200 font-bold mb-2">
                        Notes
                      </div>
                      <div className="text-slate-400 text-sm leading-relaxed">
                        If factor data is provided by the backend, charts reflect
                        the model’s explanation output. Otherwise, they fall
                        back to a normalized view of your submitted metrics.
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

export default AssessmentPage;
