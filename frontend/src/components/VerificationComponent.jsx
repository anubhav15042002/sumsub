import React, { useEffect, useState } from "react";
import SumsubWebSdk from "@sumsub/websdk-react";

function VerificationComponent({ userId }) {
  const [accessToken, setAccessToken] = useState(null);

  async function fetchToken() {
    try {
      const response = await fetch("http://localhost:5075/get-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.success) {
        setAccessToken(data.data.token);
      } else {
        console.error("Failed to fetch token:", data.message);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }

  useEffect(() => {
    fetchToken();
  }, [userId]);

  if (!accessToken) {
    return <div>Loading verification...</div>;
  }

  return (
    <SumsubWebSdk
      accessToken={accessToken}
      expirationHandler={fetchToken} // Refreshes token when it expires
      config={{
        lang: "en", // Language (e.g., 'en' for English)
      }}
      onMessage={(type, payload) => {
        console.log("SumSub Message:", type, payload); // Logs events like step completion
      }}
      onError={(error) => {
        console.log("SumSub Error:", error); // Logs errors
      }}
    />
  );
}

export default VerificationComponent;
