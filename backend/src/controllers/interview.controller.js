const { PDFParse } = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @name generateInterviewReportController
 * @description generates interview report on the basis of user self description, resume pdf and job description
 * @access private
 */
async function generateInterviewReportController(req, res) {
    const { selfDescription, jobDescription } = req.body;
    if (!selfDescription || !jobDescription || !req.file) {
        return res.status(422).json({
            message: "Please provide self description, job description and resume"
        })
    }
    const parser = new PDFParse({ data: req.file.buffer });
    const resumeContent = await parser.getText();

    try {
        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi,
            meta: {
                modelUsed: "gemini-2.5-flash"
            }
        });

        return res.status(201).json({
            message: "Interview Report generated successfully",
            data: interviewReport
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message || "Failed to generate interview report"
        });
    }
}

module.exports = {
    generateInterviewReportController
}