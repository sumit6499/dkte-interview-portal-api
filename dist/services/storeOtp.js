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
Object.defineProperty(exports, "__esModule", { value: true });
const databse_1 = require("../setup/databse");
const storeOtp = (id, otp, expiresAt, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user === 'student') {
        const data = yield databse_1.prisma.otp.create({
            //@ts-ignore
            data: {
                otp: otp,
                studentId: id,
                expiresAt: expiresAt
            }
        });
        return data;
    }
    else {
        const data = yield databse_1.prisma.otp.create({
            //@ts-ignore
            data: {
                otp: otp,
                interviewID: id,
                expiresAt: expiresAt
            }
        });
        return data;
    }
});
exports.default = storeOtp;
//# sourceMappingURL=storeOtp.js.map