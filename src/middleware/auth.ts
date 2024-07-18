import jwt,{JwtPayload} from "jsonwebtoken";
import { Request,Response,NextFunction } from "express";
import dotenv from "dotenv";
import { winstonLogger as logger } from "./logger";
dotenv.config();

interface DecodedToken extends JwtPayload{
  id?:string
}

const auth = async (req:Request, res:Response, next:NextFunction) => {
  try {

    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        msg: "Authorization token missing",
      });
    }

    if(!process.env.JWT_SECRET_KEY){
      throw new Error("JWT secret missing in enviourment variable")
    }
    
    const token = req.headers.authorization.split(" ")[1];


    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY) as DecodedToken;

    if(!decodedData.id){
      throw new Error("Decoded data doesn't contain id")
    }

    //@ts-ignore
    req.userid = decodedData?.id;

    next();
  } catch (error) {
    logger.error(error.message)
    return res.status(401).json({
      success: false,
      msg: "Middleware error: Unauthorized",
    });
  }
};



export default auth;
