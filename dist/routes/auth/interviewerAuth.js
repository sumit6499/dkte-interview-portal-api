"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interviewer_1 = require("../../controllers/interviewer");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
router.post("/login", interviewer_1.login);
router.post("/signup", upload.single("idCard"), interviewer_1.signUp);
exports.default = router;
//# sourceMappingURL=interviewerAuth.js.map