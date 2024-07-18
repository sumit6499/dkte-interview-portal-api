"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLogger = exports.logger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = require("winston");
const { colorize, combine, json, timestamp } = winston_1.format;
const consoleFormat = combine(winston_1.format.colorize(), winston_1.format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message} : ${timestamp}`;
}));
const winstonLogger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(json(), colorize(), timestamp()),
    transports: [
        new winston_1.transports.Console({
            format: consoleFormat
        }),
    ]
});
exports.winstonLogger = winstonLogger;
const morganFormat = ':method :url :status :response-time ms';
const logger = (0, morgan_1.default)(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(' ')[0],
                url: message.split(' ')[1],
                status: message.split(' ')[2],
                responseTime: message.split(' ')[3],
            };
            winstonLogger.info(JSON.stringify(logObject));
        }
    }
});
exports.logger = logger;
//# sourceMappingURL=logger.js.map