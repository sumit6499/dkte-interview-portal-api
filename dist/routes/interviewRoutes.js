"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const interview_1 = require("../controllers/interview");
const router = express_1.default.Router();
router.post("/:id/schedule", auth_1.default, interview_1.scheduleInterview);
router.get("/:id/all", auth_1.default, interview_1.getInterviews);
router.get("/:id/feedback", auth_1.default, interview_1.getFeedback);
router.post("/:id/feedback/create", auth_1.default, interview_1.createFeedback);
exports.default = router;
//# sourceMappingURL=interviewRoutes.js.map