"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const interviewer_1 = require("../controllers/interviewer");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
router.get("/:day/all", auth_1.default, interviewer_1.getInterviewers);
router.put("/:id", auth_1.default, interviewer_1.updateInterviewerInfo);
router.patch("/:id/upload", upload.single("resume"), auth_1.default, interviewer_1.uploadIDcard);
exports.default = router;
//# sourceMappingURL=interviewerRoutes.js.map