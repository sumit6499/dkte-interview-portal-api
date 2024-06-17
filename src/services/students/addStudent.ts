import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface StudentDetails{
    name:string,
    idCardURL:string,
    email:string,
    dept?:string
    phone:string,
    PRN:string,
    encryptedPassword:string,
    resumeURL:string,
    UPI:string,
    paymentImgURL:string,
}

const addStudent=async({name,idCardURL,email,phone,dept,PRN,encryptedPassword,resumeURL,UPI,paymentImgURL}:StudentDetails)=>{

    const student = await prisma.student.create({
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
}

export default addStudent;
