import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.VITE_GOOGLE_API_KEY || "AIzaSyC74y2dhD-ls33JGQnXaf05s205yWFdEAA";

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const models = await genAI.listModels();
        console.log("Available Models:");
        console.log(JSON.stringify(models, null, 2));
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
