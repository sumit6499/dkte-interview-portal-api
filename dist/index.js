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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = require("./middleware/logger");
const databse_1 = __importDefault(require("./setup/databse"));
const studentAuth_1 = __importDefault(require("./routes/auth/studentAuth"));
const adminAuth_1 = __importDefault(require("./routes/auth/adminAuth"));
const interviewerAuth_1 = __importDefault(require("./routes/auth/interviewerAuth"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const interviewRoutes_1 = __importDefault(require("./routes/interviewRoutes"));
const interviewerRoutes_1 = __importDefault(require("./routes/interviewerRoutes"));
const rateLimiter_1 = __importDefault(require("./middleware/rateLimiter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000 || process.env.PORT;
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use(express_1.default.urlencoded({ limit: "30mb", extended: true }));
app.use(express_1.default.json({ limit: "30mb" }));
app.use((0, cookie_parser_1.default)());
app.use(logger_1.logger);
app.use(rateLimiter_1.default);
//Auth routes
app.use("/students", studentAuth_1.default);
app.use("/admin", adminAuth_1.default);
app.use("/interviewer", interviewerAuth_1.default);
//api routes
app.use("/api/v1/auth/students", studentRoutes_1.default);
app.use("/api/v1/auth/admin", adminRoutes_1.default);
app.use("/api/v1/auth/interview", interviewRoutes_1.default);
app.use("/api/v1/auth/interviewer", interviewerRoutes_1.default);
//database connect
(0, databse_1.default)();
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        success: true,
        msg: "Hello from server",
    });
}));
app.listen(PORT, () => {
    console.log("server running on port 3000");
});
//# sourceMappingURL=index.js.map