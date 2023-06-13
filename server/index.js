const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const configuration = new Configuration({
    organization: "org-Ratuv0X5bHbIHK38XXp2nN0e",
    apiKey: "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",

});
const openai = new OpenAIApi(configuration);


const app = express()
app.use(bodyParser.json())
app.use(cors())

const port = 3010

app.post('/', async (req, res) => {
    let { message , currentModel} = req.body;
    if(!currentModel) currentModel = "text-davinci-003"
    console.log(message, currentModel, "message")

    //TODO NEED TO CHANGE TO CHAT COMPLETION
    const response = await openai.createCompletion({
        model:`${currentModel}`,
        prompt: `${message}`,
        max_tokens: 100,
        temperature: 0.5,
      });
      
    res.json({
       // data: response.data,
        message: response.data.choices[0].text,
    })
});


app.get('/models', async (req, res) => {
    const response = await openai.listEngines();
    res.json({
        models: response.data
    })

});
      

app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
});