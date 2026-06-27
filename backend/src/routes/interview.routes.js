const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");
const { generateInterviewReportController, getSingleInterviewReport, getAllInterviewReports } = require("../controllers/interview.controller");

const interviewRouter = Router();

/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description, resume pdf and job description
 * @access private
 */
interviewRouter.post("/", authMiddleware, upload.single("resume"), generateInterviewReportController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get a single interview report details via ID
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware, getSingleInterviewReport);

/**
 * @route GET /api/interview/report
 * @description get all interview reports of the logged in user
 * @access private
 */
interviewRouter.get("/report", authMiddleware, getAllInterviewReports);

module.exports = interviewRouter;