import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const connect = async () => {
  await prisma
    .$connect()
    .then(() => {
      console.log("Postgres connected");
    })
    .catch((err) => {
      console.log(err)
      return err
    });
};

export default connect;
