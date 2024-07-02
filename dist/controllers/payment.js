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
exports.getPayment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: _id } = req.params;
        if (!_id) {
            return res.status(400).json({
                success: false,
                msg: "Please provide student id",
            });
        }
        const payment = yield prisma.student.findFirst({
            where: {
                id: _id,
            },
            include: {
                Payment: true,
            },
        });
        return res.status(200).json({
            success: false,
            msg: "Payment data successfully fetched",
            data: payment,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
});
exports.getPayment = getPayment;
//# sourceMappingURL=payment.js.map