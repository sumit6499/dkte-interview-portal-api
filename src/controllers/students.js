import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const postLogin = async (req, res) => {
  const { name, prn, email, password, phone } = req.body;
  try {
    if (!name || !prn || !password || !phone ||!email) {
        return res.status(400).json({
            succes:false,
            msg:"Please provide all details"
        })
    }

    
  } catch (error) {
    console.log(error);
    res.status(401).json({
      succes: false,
      msg: "Internal Server error",
    });
  }
};

export { postLogin };
