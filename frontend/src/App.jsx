import React from "react";
import VerificationComponent from "./components/VerificationComponent";
import "./App.css"

function App() {
  return (
    <div className="main-container">
      <h1 className="title">SumSub Verification</h1>
      <br />
      <VerificationComponent userId="testUser12121212" />
    </div>
  );
}

export default App;
