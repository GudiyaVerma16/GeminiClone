import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = "AIzaSyCKKdsXMu01VReiGYevfpv34Htuh_u6XZQ"; // Use your actual API key here
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp", // This would be the model you are using
});

const generationConfig = {
  temperature: 1, // The level of creativity in responses
  topP: 0.95, // Controls diversity of the model's output
  topK: 40, // Another parameter for controlling diversity
  maxOutputTokens: 8192, // Maximum length of the response
  responseMimeType: "text/plain", // Mime type for response
};

async function run(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  try {
    const result = await chatSession.sendMessage(prompt);
    if (
      result &&
      result.response &&
      typeof result.response.text === "function"
    ) {
      const responseText = await result.response.text();
      console.log("API Response:", responseText); // Log the response
      return responseText;
    } else {
      console.error("Unexpected response format:", result);
      throw new Error("Invalid response from the API.");
    }
  } catch (error) {
    console.error("Error in run function:", error.message);
    throw new Error("Failed to fetch response. Please try again later.");
  }
}

export default run;
