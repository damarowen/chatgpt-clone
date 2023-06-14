const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3010;

const instruction = {
  role: "system",
  content:
    "You are ChatGPT, a large language model trained by OpenAI. Carefully heed the user's instructions. Respond using Markdown.",
};

let chatHistory = [instruction]; // Store the chat history

app.post("/", async (req, res) => {
  try {

    let { message, currentModel } = req.body;

    if (!currentModel) currentModel = "gpt-3.5-turbo";

    // Add the user's message to the chat history
    chatHistory.push({ role: "user", content: message });

    const response = await openai.createChatCompletion({
      model: `${currentModel}`,
      messages: chatHistory,
      max_tokens: 100,
      temperature: 0.5,
    });

    // Add the assistant's response to the chat history
    chatHistory.push(response.data.choices[0].message);

    res.json({
      message: response.data.choices[0].message,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: `An error occurred ${error}.` });
  }
});

app.get("/models", async (req, res) => {
  try {
    const response = await openai.listModels();
    const filteredModels = response.data.data.filter(model => model.id.includes("gpt"));

    res.json({
      data: filteredModels,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: `An error occurred ${error}.` });
  }
});

app.get("/clear", async (req, res) => {
  try {
    chatHistory = [instruction];
    res.json({
      message: "success",
      chatHistory,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: `An error occurred ${error}.` });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
