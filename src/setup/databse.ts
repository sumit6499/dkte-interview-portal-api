import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
import {winstonLogger as logger} from '../middleware/logger'


const connect = async () => {
  await prisma
    .$connect()
    .then(() => {
      logger.info("Postgres connected successfully")
    })
    .catch((err:ErrorCallback) => {
      console.log(err)
      logger.error(JSON.stringify(err))      
    });
};

export default connect;
