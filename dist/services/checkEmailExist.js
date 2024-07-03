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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const checkEmailExist = (email, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user === 'student') {
        const student = yield prisma.student.findFirst({
            where: {
                email: email
            }
        });
        if (student)
            return student;
        return null;
    }
    else {
        const interviewer = yield prisma.interviewer.findFirst({
            where: {
                email: email
            }
        });
        if (interviewer)
            return interviewer;
        return null;
    }
});
exports.default = checkEmailExist;
//# sourceMappingURL=checkEmailExist.js.map