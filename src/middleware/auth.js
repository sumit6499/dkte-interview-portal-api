import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        msg: "Authorization token missing",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log(decodedData)

    req.userid = decodedData?.id;

    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      msg: "Middleware error",
    });
  }
};

export default auth;
