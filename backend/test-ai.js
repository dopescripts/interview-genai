const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("The match score between the resume and the job description, ranging from 0 to 100"),
    technicalQuestions: z.array(
        z.object({
            question: z.string().describe("The technical question that can be asked in the interview"),
            intention: z.string().describe("The intention of the question, why this question can be asked in the interview"),
            answer: z.string().describe("How to answer this question, what points to cover etc.."),
        })
    ).describe("Technical questions that can be asked in the interview along with intention and answers"),
});

async function run() {
    const jsonSchema = zodToJsonSchema(interviewReportSchema);
    console.log("JSON SCHEMA:", JSON.stringify(jsonSchema, null, 2));

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a mock report with a matchScore of 80 and one technical question.",
            config: {
                responseSchema: jsonSchema,
                responseMimeType: "application/json",
                temperature: 1.0,
            },
        });
        console.log("RESPONSE TEXT:", response.text);
    } catch (e) {
        console.error("ERROR:", e);
    }
}

run();
