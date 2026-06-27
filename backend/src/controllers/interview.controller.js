const { PDFParse } = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const { default: mongoose } = require("mongoose");

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

/**
 * @name getSingleInterviewReport
 * @description Controller to get interview report by interviewId
 */
async function getSingleInterviewReport(req, res) {
    const { interviewId } = req.params;

    
    if (!interviewId) {
        return res.status(400).json({
            message: "Please provide interviewId"
        });
    }

    try {

        const id = new mongoose.Types.ObjectId(interviewId);
    
        const interviewReport = await interviewReportModel.findById(id);
    
        if (!interviewReport) {
            res.status(404).json({
                message: "Invalid ID"
            });
        }
    
        if (req.user.id != interviewReport.user) {
            res.status(403).json({
                message: "You are not authorized to access this report"
            });
        }
        
        res.status(200).json({
            message: "Interview Report retrieved successfully",
            data: interviewReport
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || 'Something went wrong'
        })
    }

}

/**
 * @name getAllInterviewReports
 * @description Controller to get all interview reports of the logged in user
 * @access private
 */
async function getAllInterviewReports(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id });
        res.status(200).json({
            message: "Interview Reports retrieved successfully",
            data: interviewReports
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || 'Something went wrong'
        })
    }
}

module.exports = {
    generateInterviewReportController,
    getSingleInterviewReport,
    getAllInterviewReports
}