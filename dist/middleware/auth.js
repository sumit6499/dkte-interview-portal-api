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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./logger");
dotenv_1.default.config();
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({
                success: false,
                msg: "Authorization token missing",
            });
        }
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT secret missing in enviourment variable");
        }
        const token = req.headers.authorization.split(" ")[1];
        const decodedData = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        if (!decodedData.id) {
            throw new Error("Decoded data doesn't contain id");
        }
        //@ts-ignore
        req.userid = decodedData === null || decodedData === void 0 ? void 0 : decodedData.id;
        next();
    }
    catch (error) {
        logger_1.winstonLogger.error(error.message);
        return res.status(401).json({
            success: false,
            msg: "Middleware error: Unauthorized",
        });
    }
});
exports.default = auth;
//# sourceMappingURL=auth.js.map