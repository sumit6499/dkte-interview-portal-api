"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const admin_1 = require("../controllers/admin");
const router = express_1.default.Router();
router.patch("/:id", auth_1.default, admin_1.updateAdmin);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map