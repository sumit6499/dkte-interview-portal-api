"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterviews = exports.createFeedback = exports.getFeedback = exports.scheduleInterview = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const mail_1 = __importDefault(require("../feat/mail"));
const moment_1 = __importDefault(require("moment"));
const logger_1 = require("../middleware/logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const scheduleInterview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, dateString, startedAt, endsAt, interviewID, facultyID } = req.body;
        const { id: _id } = req.params;
        if (!link || !dateString || !startedAt || !endsAt || !interviewID || !_id || !facultyID) {
            return res.status(400).json({
                success: false,
                msg: "Please provide all details",
            });
        }
        const existingUser = yield prisma.student.findFirst({
            where: {
                id: _id,
            },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                msg: "No such student exist",
            });
        }
        const [year, month, day] = dateString.split("-").map(Number);
        const [startHours, startMinutes] = startedAt.split(":").map(Number);
        const [endHours, endMinutes] = endsAt.split(":").map(Number);
        const date = new Date(year, month - 1, day);
        const startTime = new Date(year, month - 1, day, startHours, startMinutes);
        const endTime = new Date(year, month - 1, day, endHours, endMinutes);
        const interview = yield prisma.interview.create({
            data: {
                link: link,
                date: date,
                startedAt: startTime,
                endsAt: endTime,
                facultyId: facultyID
            },
        });
        const student = yield prisma.student.update({
            where: {
                id: _id,
            },
            data: {
                interviews: {
                    connect: {
                        id: interview.id,
                    },
                },
            },
        });
        const interviewer = yield prisma.interviewer.update({
            where: {
                id: interviewID,
            },
            data: {
                interviews: {
                    connect: {
                        id: interview.id,
                    },
                },
            },
        });
        const formattedDate = (0, moment_1.default)(interview.date).format("YYYY-MM-DD");
        const formattedTime = (0, moment_1.default)(interview.startedAt).format("hh:mm A");
        //mail sending feat
        (0, mail_1.default)(process.env.MAIL_USER_ID, `${student.email} , ${interviewer.email}`, `${student.name}`, `${interviewer.name}`, `${interview.link}`, `${formattedDate}`, `${formattedTime}`);
        return res.status(200).json({
            success: true,
            msg: "Interview scheduled successfully",
        });
    }
    catch (error) {
        logger_1.winstonLogger.error(JSON.stringify(error));
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
});
exports.scheduleInterview = scheduleInterview;
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { technical, communication, behaviour, apperance, feedback: feedbackText, } = req.body;
        const { id: _id } = req.params;
        if (!technical ||
            !communication ||
            !behaviour ||
            !apperance ||
            !feedbackText) {
            return res.status(400).json({
                success: false,
                msg: "Please provide all details",
            });
        }
        const existingFeedback = yield prisma.feedback.findFirst({
            where: {
                interviewId: _id,
            },
        });
        if (existingFeedback) {
            return res.status(409).json({
                success: true,
                msg: "Feedback can't be submitted more than once",
            });
        }
        const technicalNum = parseInt(technical, 10);
        const communicationNum = parseInt(communication, 10);
        const behaviourNum = parseInt(behaviour, 10);
        const apperanceNum = parseInt(apperance, 10);
        const newFeedback = yield prisma.feedback.create({
            data: {
                technical: technicalNum,
                communication: communicationNum,
                behaviour: behaviourNum,
                apperance: apperanceNum,
                feedback: feedbackText,
                interviewId: _id,
            },
        });
        return res.status(200).json({
            success: true,
            msg: "Feedback created successfully",
        });
    }
    catch (error) {
        logger_1.winstonLogger.error(JSON.stringify(error));
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
});
exports.createFeedback = createFeedback;
const getFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: _id } = req.params;
        const interviews = yield prisma.interview.findMany({
            include: {
                feedback: true
            }
        });
        const feedback = yield prisma.interview.findFirst({
            where: {
                id: _id,
            },
            include: {
                feedback: true,
            },
        });
        if (!feedback) {
            return res.status(404).json({
                success: false,
                msg: "Feedback not found",
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Feedback fetched successfully",
            data: feedback,
        });
    }
    catch (error) {
        logger_1.winstonLogger.error(JSON.stringify(error));
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
});
exports.getFeedback = getFeedback;
const getInterviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: _id } = req.params;
        const { filter } = req.query;
        if (filter === "today") {
            const date = new Date();
            const interview = yield prisma.interview.findMany({
                where: {
                    date: date,
                    OR: [
                        {
                            studentId: _id,
                        },
                        {
                            interviewerId: _id,
                        },
                        {
                            facultyId: _id,
                        },
                    ],
                },
            });
            if (!interview) {
                return res.status(404).json({
                    success: false,
                    msg: "No interview found",
                });
            }
            return res.status(200).json({
                success: true,
                msg: "Interview fetched successfully",
                data: interview,
            });
        }
        if (filter === "upcoming") {
            const upcomingDay = new Date();
            upcomingDay.setDate(upcomingDay.getDate() + 1);
            const upcomingInterview = yield prisma.interview.findMany({
                where: {
                    date: {
                        gte: upcomingDay,
                    },
                    OR: [
                        {
                            studentId: _id,
                        },
                        {
                            interviewerId: _id,
                        },
                        {
                            facultyId: _id,
                        },
                    ],
                },
            });
            console.log(upcomingInterview);
            if (!upcomingInterview) {
                return res.status(404).json({
                    success: false,
                    msg: "No upcoming interview found",
                });
            }
            return res.status(200).json({
                success: true,
                msg: "Upcoming interview fetched successfully",
                data: upcomingInterview,
            });
        }
        if (filter === "previous") {
            const previousDay = new Date();
            previousDay.setDate(previousDay.getDate() - 1);
            const previousInterview = yield prisma.interview.findMany({
                where: {
                    date: {
                        lte: previousDay,
                    },
                    OR: [
                        {
                            studentId: _id,
                        },
                        {
                            interviewerId: _id,
                        },
                        {
                            facultyId: _id,
                        },
                    ],
                },
            });
            if (!previousInterview) {
                return res.status(404).json({
                    success: false,
                    msg: "No previous interview",
                });
            }
            return res.status(200).json({
                success: true,
                msg: "Previous interview fetched successfully",
                data: previousInterview,
            });
        }
        return res.status(400).json({
            success: false,
            msg: "Filter value invalid",
        });
    }
    catch (error) {
        logger_1.winstonLogger.error(JSON.stringify(error));
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
});
exports.getInterviews = getInterviews;
//# sourceMappingURL=interview.js.map