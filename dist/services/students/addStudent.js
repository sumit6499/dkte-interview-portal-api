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
const addStudent = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, idCardURL, email, phone, dept, PRN, encryptedPassword, resumeURL, UPI, paymentImgURL }) {
    const student = yield prisma.student.create({
        data: {
            name: name,
            id_card: idCardURL,
            email: email,
            phone: phone,
            //@ts-ignore
            dept: dept,
            PRN: PRN,
            password: encryptedPassword,
            resume: resumeURL,
            Payment: {
                create: {
                    transactionId: UPI,
                    image: paymentImgURL,
                },
            },
        },
    });
});
exports.default = addStudent;
//# sourceMappingURL=addStudent.js.map