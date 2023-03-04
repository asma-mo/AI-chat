import express from "express"; //sama as const express = require("express");
import * as dotenv from "dotenv";
import cors from "cors";
import {Configuration,OpenAIApi} from "openai";
import bodyPareser from "body-parser";
// const envify = require('loose-envify');

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = new express();
app.use(bodyPareser.urlencoded({extended : true}));
app.use(cors());
app.use(express.json());

app.get("/", async (req,res)=> {
    res.status(200).send({
        message: "Hello world",
        
        
    })
});

app.post("/", async (req,res)=> {
    try {

        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt, //or `${prompt}`
            temperature: 0, //risk percentage 
            max_tokens: 3000, //length of responses
            top_p: 1,
            frequency_penalty: 0, //repetation of responses
            presence_penalty: 0,
            
          });

        res.status(200).send({
            bot: response.data.choices[0].text,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({error});
    }
});

app.listen(9000,()=>{
    console.log("server is running on port http://localhost:9000");
});