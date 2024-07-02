"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = require("express-rate-limit");
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 10 * 60 * 1000, //10min
    limit: 100, //100 request in 10 min
    standardHeaders: 'draft-6',
    legacyHeaders: false,
});
exports.default = limiter;
//# sourceMappingURL=rateLimiter.js.map