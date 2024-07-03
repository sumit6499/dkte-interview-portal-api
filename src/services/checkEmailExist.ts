import {PrismaClient} from '@prisma/client'
const prisma=new PrismaClient()

const checkEmailExist=async (email:string,user:string)=>{
    if(user==='student'){
        const student= await prisma.student.findFirst({
            where:{
                email:email
            }
        })

        if(student)
            return student
        return null
    }else{
        const interviewer=await prisma.interviewer.findFirst({
            where:{
                email:email
            }
        })

        if(interviewer)
            return interviewer
        return null
    }

}

export default checkEmailExist