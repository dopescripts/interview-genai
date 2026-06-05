const { GoogleGenAI, Type, ApiError } = require('@google/genai');
const { z } = require('zod');

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
    behavioralQuestions: z.array(
        z.object({
            question: z.string().describe("The behavioral question that can be asked in the interview"),
            intention: z.string().describe("The intention of the question, why this question can be asked in the interview"),
            answer: z.string().describe("How to answer this question, what points to cover etc.."),
        })
    ).describe("Behavioral questions that can be asked in the interview along with intention and answers"),
    skillGaps: z.array(
        z.object({
            skill: z.string().describe("The skill gap, the skill that is candidate lacking"),
            severity: z.enum(["high", "medium", "low"]).describe("The severity of the skill gap, high, medium, or low"),
        })
    ).describe("Skill gaps that are present in the candidate"),
    preparationPlan: z.array(
        z.object({
            day: z.number().describe("The day number, starting from 1"),
            focus: z.string().describe("The main focus area for this day."),
            tasks: z.array(z.string().describe("The specific tasks to be completed on the day")),
        })
    ).describe("Day-wise preparation plan for the candidate to prepare for the interview effectively"),
});

async function invokeGeminiAi() {

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: 'Hello gemini, Explain what are modules like predictive analysis, discrepancy alerts, QC interpretation, pattern recognition in the context of a Laboratory Saas Management System',
        });
        console.log(response.text);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Generate interview report
 * @param {Object} param0
 * @param {string} param0.resume
 * @param {string} param0.selfDescription
 * @param {string} param0.jobDescription
 * @returns {Promise<Object>}
 */
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const systemPrompt = `
    Generate an interview report for a candidate with the following details
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            matchScore: { type: Type.NUMBER, description: "The match score between the resume and the job description, ranging from 0 to 100" },
            technicalQuestions: {
                type: Type.ARRAY,
                description: "Technical questions that can be asked in the interview along with intention and answers",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING, description: "The technical question that can be asked in the interview" },
                        intention: { type: Type.STRING, description: "The intention of the question, why this question can be asked in the interview" },
                        answer: { type: Type.STRING, description: "How to answer this question, what points to cover etc.." }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            behavioralQuestions: {
                type: Type.ARRAY,
                description: "Behavioral questions that can be asked in the interview along with intention and answers",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING, description: "The behavioral question that can be asked in the interview" },
                        intention: { type: Type.STRING, description: "The intention of the question, why this question can be asked in the interview" },
                        answer: { type: Type.STRING, description: "How to answer this question, what points to cover etc.." }
                    },
                    required: ["question", "intention", "answer"]
                }
            },
            skillGaps: {
                type: Type.ARRAY,
                description: "Skill gaps that are present in the candidate",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        skill: { type: Type.STRING, description: "The skill gap, the skill that is candidate lacking" },
                        severity: {
                            type: Type.STRING,
                            description: "The severity of the skill gap",
                            enum: ["high", "medium", "low"]
                        }
                    },
                    required: ["skill", "severity"]
                }
            },
            preparationPlan: {
                type: Type.ARRAY,
                description: "Day-wise preparation plan for the candidate to prepare for the interview effectively",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.NUMBER, description: "The day number, starting from 1" },
                        focus: { type: Type.STRING, description: "The main focus area for this day." },
                        tasks: {
                            type: Type.ARRAY,
                            description: "The specific tasks to be completed on the day",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["day", "focus", "tasks"]
                }
            }
        },
        required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
    };

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
        config: {
            responseSchema: responseSchema,
            responseMimeType: "application/json",
            temperature: 1.0,
        },
    }).catch((ApiError) => {
        throw JSON.parse(ApiError.message);
    });

    if (!response || !response.text) {
        throw new Error("Failed to generate interview report");
    }

    const reportData = interviewReportSchema.parse(JSON.parse(response.text));
    return reportData;
}

module.exports = { invokeGeminiAi, generateInterviewReport };