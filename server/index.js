const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const configuration = new Configuration({
  organization: "org-Ratuv0X5bHbIHK38XXp2nN0e",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 3010;

let chatHistory = []; // Store the chat history

app.post("/", async (req, res) => {
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

  console.log(chatHistory,"<<<<<<<<<<<<<chatHistory<<<<<")
  res.json({
    message: response.data.choices[0].message,
  });
});

app.get("/models", async (req, res) => {
  const response = await openai.listEngines();
  res.json({
    models: response.data,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
