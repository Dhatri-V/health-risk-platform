import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import AssessmentPage from "./pages/AssessmentPage";

function App() {
  const [page, setPage] = useState("landing");

  return (
    <>
      {page === "landing" && (
        <LandingPage
          onStart={() => setPage("assessment")}
        />
      )}

      {page === "assessment" && (
        <AssessmentPage />
      )}
    </>
  );
}

export default App;