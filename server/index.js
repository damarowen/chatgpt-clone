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

app.post("/", async (req, res) => {
  console.log(process.env.OPENAI_API_KEY, "<<<<<<<<<<<<");
  let { message, currentModel } = req.body;
  console.log("🚀 ~ file: index.js:24 ~ app.post ~ message:", message)
  if (!currentModel) currentModel = "gpt-3.5-turbo";
  //console.log(message, currentModel, "message")

  
  const response = await openai.createChatCompletion({
    model: `${currentModel}`,
    messages: [{ role: "user", content: `${message}` }],
    max_tokens: 100,
    temperature: 0.5,
  });

  res.json({
    message: response.data.choices[0].message.content,
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
