import { prisma } from "../setup/databse"

const storeOtp = async (id: string, otp: string, expiresAt: Date, user: string) => {
    try {
        if (user === 'student') {
            const student = await prisma.student.findUnique({
                where: { id: id },
                include: { Otp: true }
            });
    
            if (student?.Otp) {
                const data = await prisma.otp.update({
                    where: {
                        id: student.Otp.id
                    },
                    data: {
                        otp: otp,
                        expiresAt: expiresAt
                    }
                });
                return data
            } else {
                const data = await prisma.otp.create({
                    data: {
                        otp: otp,
                        expiresAt: expiresAt,
                        Student: {
                            connect: { id: id }
                        }
                    }
                });
                return data
            }
        } else {
            const interviewer = await prisma.interviewer.findUnique({
                where: { id: id },
                include: { Otp: true }
            });
    
            if (interviewer?.Otp) {
                // Update existing Otp record
                const data = await prisma.otp.update({
                    where: {
                        id: interviewer.Otp.id
                    },
                    data: {
                        otp: otp,
                        expiresAt: expiresAt
                    }
                });
                return data;
            } else {
                const data = await prisma.otp.create({
                    //@ts-ignore
                    data: {
                        otp: otp,
                        expiresAt: expiresAt,
                        Interviewer: {
                            connect: { id: id }
                        }
                    }
                });
                return data;
            }
        }
    } catch (error) {
        return false
    }
}

export default storeOtp;
