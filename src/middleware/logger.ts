import {Request,Response,NextFunction} from 'express'
import moment from 'moment'

const logger=(req:Request,res:Response,next:NextFunction)=>{
    console.log(
      "http method=>" + `${req.method} -> ${req.originalUrl} ->`+`${req.socket.remoteAddress}` + moment(Date.now()).format('YYYY-MM-DD-HH-MM')
    );
    next();
}

export default logger;