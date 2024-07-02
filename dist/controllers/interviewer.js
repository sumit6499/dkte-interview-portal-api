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
exports.uploadIDcard = exports.updateInterviewerInfo = exports.getInterviewers = exports.signUp = exports.login = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const awsClient_1 = __importDefault(require("../setup/awsClient"));
const logger_1 = require("../middleware/logger");
dotenv_1.default.config();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, freeday, startTime, endTime, password } = req.body;
    const idCard = req.file;
    try {
        if (!name ||
            !freeday ||
            !password ||
            !phone ||
            !email ||
            !startTime ||
            !endTime ||
            !idCard) {
            return res.status(400).json({
                succes: false,
                msg: "Please provide all details",
            });
        }
        const existingUser = yield prisma.interviewer.findFirst({
            where: {
                email: { equals: email },
            },
        });
        if (existingUser) {
            return res.status(403).json({
                success: false,
                msg: "User already present",
            });
        }
        const encryptedPassword = yield bcrypt_1.default.hash(password, 12);
        const getIdCardURL = () => __awaiter(void 0, void 0, void 0, function* () {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `interviewer/idCard/${idCard.originalname}`,
                Body: idCard.buffer,
                ContentType: idCard.mimetype,
            });
            yield awsClient_1.default.send(command);
            const getObjectCmd = new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `interviewer/idCard/${idCard.originalname}`,
            });
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(awsClient_1.default, getObjectCmd, {
                expiresIn: 60 * 60 * 24 * 7,
            });
            return url;
        });
        const idCardURL = yield getIdCardURL();
        const interviewer = yield prisma.interviewer.create({
            data: {
                name: name,
                email: email,
                phone: phone,
                freeday: freeday,
                startTime: startTime,
                endTime: endTime,
                password: encryptedPassword,
                id_card: idCardURL,
            },
        });
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('Jwt secret not found');
        }
        const token = jsonwebtoken_1.default.sign({ email: interviewer.email, id: interviewer.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        return res.status(200).json({
            succes: true,
            data: interviewer,
            token: token,
            msg: "User Successfully created",
        });
    }
    catch (error) {
        logger_1.winstonLogger.error(JSON.stringify(error));
        return res.status(401).json({
            succes: false,
            msg: "Internal Server error",
        });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                msg: "Please provide all details",
            });
        }
        const existingUser = yield prisma.interviewer.findFirst({
            where: { email: email },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                msg: "User does not exist",
            });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                msg: "Invalid credentials",
            });
        }
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error('Jwt secret not found');
        }
        const token = jsonwebtoken_1.default.sign({
            email: existingUser.email,
            id: existingUser.id,
        }, process.env.JWT_SECRET_KEY);
        return res.status(200).json({
            success: true,
            msg: "login success",
            data: existingUser,
            token: token,
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
exports.login = login;
const getInterviewers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { day } = req.params;
        const interviewers = yield prisma.interviewer.findMany({
            where: {
                //@ts-ignore
                freeday: day,
            },
        });
        if (!interviewers) {
            return res.status(404).json({
                success: false,
                msg: "Not any interviewer found ",
            });
        }
        return res.status(200).json({
            success: true,
            msg: "All interviewers data fetched successfully",
            data: interviewers,
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
exports.getInterviewers = getInterviewers;
const updateInterviewerInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: _id } = req.params;
        const interviewerData = req.body;
        if (!interviewerData) {
            return res.status(401).json({
                success: false,
                msg: "Please provide details",
            });
        }
        const existingUser = yield prisma.interviewer.findFirst({
            where: {
                id: _id,
            },
        });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                msg: "Interviewer not found",
            });
        }
        const updatedInterviewer = yield prisma.interviewer.update({
            where: {
                id: _id,
            },
            data: interviewerData,
        });
        return res.status(200).json({
            success: true,
            msg: "Interviewer details updated successfully",
            data: updatedInterviewer,
        });
    }
    catch (error) {
        logger_1.winstonLogger.error(JSON.stringify(error));
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                msg: "Internal Server error",
            });
        }
    }
});
exports.updateInterviewerInfo = updateInterviewerInfo;
const uploadIDcard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_card = req.file;
        const { id: _id } = req.params;
        if (!id_card) {
            return res.status(404).json({
                success: false,
                msg: "please provide resume file",
            });
        }
        const getIdCardURL = () => __awaiter(void 0, void 0, void 0, function* () {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `interviewer/id_card/${id_card.originalname}`,
                Body: id_card.buffer,
                ContentType: id_card.mimetype,
            });
            yield awsClient_1.default.send(command);
            const getObjectCmd = new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `interviewer/idCard/${id_card.originalname}`,
            });
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(awsClient_1.default, getObjectCmd, {
                expiresIn: 60 * 60 * 24 * 7, //one week
            });
            return url;
        });
        const idCardURL = yield getIdCardURL();
        const updatedInterviewer = yield prisma.interviewer.update({
            where: {
                id: _id,
            },
            data: {
                id_card: idCardURL,
            },
        });
        return res.status(200).json({
            success: true,
            msg: "Success",
            data: updatedInterviewer,
        });
    }
    catch (error) {
        logger_1.winstonLogger.error(JSON.stringify(error));
        return res.status(500).json({
            success: false,
            msg: "Internal server errors",
        });
    }
});
exports.uploadIDcard = uploadIDcard;
//# sourceMappingURL=interviewer.js.map