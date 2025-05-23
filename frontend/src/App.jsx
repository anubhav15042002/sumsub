import React from "react";
import VerificationComponent from "./components/VerificationComponent";
import "./App.css"
console.log("Import:", import.meta.env.VITE_BACKEND_URL)

function App() {
  return (
    <div className="main-container">
      <h1 className="title">SumSub Verification</h1>
      <br />
      <VerificationComponent userId="testUser1213456" />
    </div>
  );
}

export default App;
