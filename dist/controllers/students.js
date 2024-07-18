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
exports.verifyOtp = exports.getOtpEmail = exports.getStudentInfo = exports.uploadID = exports.uploadResume = exports.getStudents = exports.deleteStudent = exports.updateStudent = exports.signUp = exports.login = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const awsClient_js_1 = __importDefault(require("../setup/awsClient.js"));
const checkEmailExist_1 = __importDefault(require("../services/checkEmailExist"));
const logger_js_1 = require("../middleware/logger.js");
const reddis_js_1 = __importDefault(require("../setup/reddis.js"));
const mail_js_1 = require("../feat/mail.js");
const storeOtp_js_1 = __importDefault(require("../services/storeOtp.js"));
const crypto_1 = require("crypto");
dotenv_1.default.config();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    try {
        const { name, PRN, email, password, phone, dept, UPI } = req.body;
        const resume = files["resume"][0];
        const idCard = files["idCard"][0];
        const paymentImg = files["paymentImage"][0];
        if (!name ||
            !PRN ||
            !password ||
            !phone ||
            !email ||
            !dept ||
            !idCard ||
            !resume ||
            !UPI ||
            !paymentImg) {
            return res.status(400).json({
                succes: false,
                msg: "Please provide all details",
            });
        }
        const existingUser = yield prisma.student.findFirst({
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
        const getResumeURL = () => __awaiter(void 0, void 0, void 0, function* () {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `student/resume/${resume.originalname}`,
                Body: resume.buffer,
                ContentType: resume.mimetype,
            });
            yield awsClient_js_1.default.send(command);
            const getObjectCmd = new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `student/resume/${resume.originalname}`,
            });
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(awsClient_js_1.default, getObjectCmd, {
                expiresIn: 60 * 60 * 24 * 7, //one week
            });
            return url;
        });
        const getIdCardURL = () => __awaiter(void 0, void 0, void 0, function* () {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `student/idCard/${idCard.originalname}`,
                Body: idCard.buffer,
                ContentType: idCard.mimetype,
            });
            yield awsClient_js_1.default.send(command);
            const getObjectCmd = new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `student/idCard/${idCard.originalname}`,
            });
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(awsClient_js_1.default, getObjectCmd, {
                expiresIn: 60 * 60 * 24 * 7,
            });
            return url;
        });
        const getPaymentImgURL = () => __awaiter(void 0, void 0, void 0, function* () {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `student/payment/${paymentImg.originalname}`,
                Body: paymentImg.buffer,
                ContentType: paymentImg.mimetype,
            });
            yield awsClient_js_1.default.send(command);
            const getObjectCmd = new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `student/payment/${paymentImg.originalname}`,
            });
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(awsClient_js_1.default, getObjectCmd, {
                expiresIn: 60 * 60 * 24 * 7,
            });
            return url;
        });
        const resumeURL = yield getResumeURL();
        const idCardURL = yield getIdCardURL();
        const paymentImgURL = yield getPaymentImgURL();
        // addStudent()
        const student = yield prisma.student.create({
            data: {
                name: name,
                id_card: idCardURL,
                email: email,
                phone: phone,
                dept: dept,
                PRN: PRN,
                password: encryptedPassword,
                resume: resumeURL,
                Payment: {
                    create: {
                        transactionId: UPI,
                        image: paymentImgURL,
                    },
                },
            },
        });
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT secret not found");
        }
        const token = jsonwebtoken_1.default.sign(
        //@ts-ignore
        { email: email, id: student.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        return res.status(200).json({
            succes: true,
            data: student,
            token: token,
            msg: "User Successfully created",
        });
    }
    catch (error) {
        logger_js_1.winstonLogger.error(JSON.stringify(error));
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
        const existingUser = yield prisma.student.findFirst({
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
            throw new Error("JWT secret not found");
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
        logger_js_1.winstonLogger.error(JSON.stringify(error));
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
});
exports.login = login;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: _id } = req.params;
        const studentData = req.body;
        if (!_id || !studentData) {
            return res.status(404).json({
                success: false,
                msg: "please provide student details",
            });
        }
        const student = yield prisma.student.findFirst({
            where: {
                id: _id,
            },
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                msg: "No student found",
            });
        }
        else {
            const student = yield prisma.student.update({
                where: {
                    id: _id,
                },
                data: studentData,
            });
            return res.status(200).json({
                success: true,
                msg: "Student data updated successfully",
                data: student,
            });
        }
    }
    catch (error) {
        logger_js_1.winstonLogger.error(JSON.stringify(error));
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
});
exports.updateStudent = updateStudent;
const getStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const redisClient = yield (0, reddis_js_1.default)();
        const data = JSON.parse(yield redisClient.get('students'));
        if (!data) {
            const students = yield prisma.student.findMany({
                include: {
                    interviews: true,
                },
            });
            const data = JSON.stringify(students);
            yield redisClient.set('students', data);
            yield redisClient.expire('students', 5 * 60);
            if (!students) {
                return res.status(404).json({
                    success: false,
                    msg: "Not any student found please signup",
                });
            }
            return res.status(200).json({
                success: true,
                msg: "All students data fetched successfully",
                data: students,
            });
        }
        else {
            return res.status(200).json({
                success: true,
                msg: "All students data fetched successfully",
                data: data
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
});
exports.getStudents = getStudents;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: _id } = req.params;
        if (!_id) {
            return res.status(400).json({
                success: false,
                msg: "Please provide id",
            });
        }
        const student = yield prisma.student.delete({
            where: {
                id: _id,
            },
        });
        return res.status(200).json({
            success: true,
            msg: "Student deleted successfully",
        });
    }
    catch (error) {
        logger_js_1.winstonLogger.error(JSON.stringify(error));
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
});
exports.deleteStudent = deleteStudent;
const uploadResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resume = req.file;
        const { id: _id } = req.params;
        if (!resume) {
            return res.status(404).json({
                success: false,
                msg: "please provide resume file",
            });
        }
        const getResumeURL = () => __awaiter(void 0, void 0, void 0, function* () {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `student/resume/${resume.originalname}`,
                Body: resume.buffer,
                ContentType: resume.mimetype,
            });
            yield awsClient_js_1.default.send(command);
            const getObjectCmd = new client_s3_1.GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `student/resume/${resume.originalname}`,
            });
            const url = yield (0, s3_request_presigner_1.getSignedUrl)(awsClient_js_1.default, getObjectCmd, {
                expiresIn: 60 * 60 * 24 * 7, //one week
            });
            return url;
        });
        const resumeURL = yield getResumeURL();
        const updatedStudent = yield prisma.student.update({
            where: {
                id: _id,
            },
            data: {
                resume: resumeURL,
            },
        });
        return res.status(200).json({
            success: true,
            msg: "Success",
            data: updatedStudent,
        });
    }
    catch (error) {
        logger_js_1.winstonLogger.error(JSON.stringify(error));
        return res.status(500).json({
            success: false,
            msg: "Internal server errors",
        });
    }
});
exports.uploadResume = uploadResume;
const uploadID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({
            success: true,
            msg: "Success",
        });
    }
    catch (error) {
        logger_js_1.winstonLogger.error(JSON.stringify(error));
        return res.status(500).json({
            success: false,
            msg: "Internal server errors",
        });
    }
});
exports.uploadID = uploadID;
const getStudentInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: _id } = req.params;
        const { filter } = req.query;
        if (filter === "today") {
            const date = new Date();
            const interview = yield prisma.interview.findMany({
                where: {
                    date: date,
                    studentId: _id,
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
                        gt: upcomingDay,
                    },
                    studentId: _id,
                },
            });
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
                        lt: previousDay,
                    },
                    studentId: _id,
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
        const student = yield prisma.student.findFirst({
            where: {
                id: _id,
            },
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                msg: "Not existing Student found",
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Student info fetched successfully",
            data: student,
        });
    }
    catch (error) {
        logger_js_1.winstonLogger.error(JSON.stringify(error));
        return res.status(500).json({
            success: false,
            msg: "Internal Server error",
        });
    }
});
exports.getStudentInfo = getStudentInfo;
const getOtpEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield (0, checkEmailExist_1.default)(email, 'student');
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "No user found"
            });
        }
        const otp = String((0, crypto_1.randomInt)(1000, 9999));
        const data = yield (0, storeOtp_js_1.default)(user.id, otp, new Date(Date.now() + 2 * 60 * 1000), 'student');
        if (!data) {
            throw new Error('Store Otp:Prisma Error');
        }
        const tokenData = JSON.stringify(data);
        const token = jsonwebtoken_1.default.sign(tokenData, process.env.JWT_SECRET_KEY);
        (0, mail_js_1.sendOtpNotification)(process.env.MAIL_USER_ID, user.email, otp);
        return res.status(200).json({
            success: true,
            token: token,
            msg: "Otp Sent sucessfully"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Internal Server error"
        });
    }
});
exports.getOtpEmail = getOtpEmail;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, id: _id } = req.body;
        if (!otp) {
            res.status(402).json({
                success: false,
                msg: "Otp not found",
            });
        }
        const dbOtp = yield prisma.student.findFirst({
            where: {
                id: _id
            },
            include: {
                Otp: true
            }
        });
        if (String(otp) === String(dbOtp.Otp.otp)) {
            return res.status(200).json({
                success: false,
                msg: "Otp verified successfully",
            });
        }
        else {
            return res.status(401).json({
                success: false,
                msg: "Otp doesn't match"
            });
        }
    }
    catch (error) {
        logger_js_1.winstonLogger.error(error);
        return res.status(500).json({
            success: false,
            msg: "Internal server error"
        });
    }
});
exports.verifyOtp = verifyOtp;
//# sourceMappingURL=students.js.map