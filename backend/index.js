const dotenv = require("dotenv");
const envFile = `.env.${process.env.NODE_ENV || "development"}`; // Default to 'development' if NODE_ENV is unset
dotenv.config({ path: envFile });

const config = require("./config/index.js");
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

async function generateAccessToken(userId) {
  const APP_TOKEN = config.APP_TOKEN;
  const SECRET_KEY = config.SECRET_KEY;
  const API_URL = config.API_URL;
  const LEVEL_NAME = config.LEVEL_NAME;

  const timestamp = Math.floor(Date.now() / 1000).toString();

  const data = {
    userId: userId,
    levelName: LEVEL_NAME,
    ttlInSecs: 600,
  };

  const body = JSON.stringify(data);

  const message = timestamp + "POST" + "/resources/accessTokens/sdk" + body;

  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(message)
    .digest("hex");

  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        "X-App-Token": APP_TOKEN,
        "X-App-Access-Ts": timestamp,
        "X-App-Access-Sig": signature,
        "Content-Type": "application/json",
      },
    });

    return response.data.token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
}

app.post("/get-token", async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  try {
    const token = await generateAccessToken(userId);
    return res.status(200).json({
      success: true,
      message: "Token received successfully",
      data: {
        token: token,
      },
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
