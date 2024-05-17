import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getPayment = async (req, res) => {
  try {
    const { id: _id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "Please provide student id",
      });
    }

    const payment = await prisma.student.findFirst({
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

// const postPayment = async (req, res) => {
//   try {
//     const { id: _id } = req.params;
//     const { transactionId, image } = req.body;

//     if (!_id) {
//       return res.status(400).json({
//         success: false,
//         msg: "Please provide student id",
//       });
//     }

//     const payment = await prisma.payment.create({
//       data: {
//         transactionId: transactionId,
//         image: image,
//       },
//     });

//     const student = await prisma.student.update({
//       where: {
//         id: _id,
//       },
//       data: {
//         Payment: {
//           connect: {
//             id: payment.id,
//           },
//         },
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       msg: "Payment done successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       msg: "Internal server error",
//     });
//   }
// };

export { getPayment };
