import { prisma } from "../setup/databse"

const storeOtp=async(id:string,otp:string,expiresAt:Date,user:string)=>{
    if(user==='student'){
        const data=await prisma.student.update({
            where:{
                id:id
            },
            data:{
               Otp:{
                update:{
                    otp:otp,
                    expiresAt:expiresAt
                }
               }
            }
        })
        return data
    }else{
        const data=await prisma.interviewer.update({
            where:{
                id:id
            },
            data:{
               Otp:{
                update:{
                    otp:otp,
                    expiresAt:expiresAt
                }
               }
            }
        })
        return data
    }
}

export default storeOtp