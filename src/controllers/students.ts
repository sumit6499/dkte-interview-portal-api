import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3client from '../setup/awsClient.js'

import addStudent from '../services/students/addStudent'

dotenv.config();



const signUp = async (req:Request, res:Response) => {


  
  
  const files=req.files as {[fieldname:string]:Express.Multer.File[]}
  
  
  try {
    const { name, PRN, email, password, phone, dept, UPI } = req.body;
    const resume = files["resume"][0];
    const idCard = files["idCard"][0];
    const paymentImg = files["paymentImage"][0];
    console.log(resume,paymentImg,idCard,name,PRN,email,password,phone,dept,UPI)
    if (
      !name ||
      !PRN ||
      !password ||
      !phone ||
      !email ||
      !dept ||
      !idCard ||
      !resume ||
      !UPI ||
      !paymentImg
    ) {
      return res.status(400).json({
        succes: false,
        msg: "Please provide all details",
      });
    }


    const existingUser = await prisma.student.findFirst({
      where: {
        email: { equals: email },
      },
    });



    if (existingUser) {
      return res.status(403).json({
        success: false,
        msg: "User already present",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    const getResumeURL = async () => {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `student/resume/${resume.originalname}`,
        Body: resume.buffer,
        ContentType: resume.mimetype,
      });
      await s3client.send(command);

      const getObjectCmd = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `student/resume/${resume.originalname}`,
      });

      const url = await getSignedUrl(s3client, getObjectCmd, {
        expiresIn: 60 * 60 * 24 * 7, //one week
      });
      return url;
    };

    const getIdCardURL = async () => {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `student/idCard/${idCard.originalname}`,
        Body: idCard.buffer,
        ContentType: idCard.mimetype,
      });

      await s3client.send(command);

      const getObjectCmd = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `student/idCard/${idCard.originalname}`,
      });

      const url = await getSignedUrl(s3client, getObjectCmd, {
        expiresIn: 60 * 60 * 24 * 7,
      });
      return url;
    };

    const getPaymentImgURL = async () => {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `student/payment/${paymentImg.originalname}`,
        Body: paymentImg.buffer,
        ContentType: paymentImg.mimetype,
      });

      await s3client.send(command);

      const getObjectCmd = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `student/payment/${paymentImg.originalname}`,
      });

      const url = await getSignedUrl(s3client, getObjectCmd, {
        expiresIn: 60 * 60 * 24 * 7,
      });
      return url;
    };

    const resumeURL = await getResumeURL();

    const idCardURL = await getIdCardURL();

    const paymentImgURL = await getPaymentImgURL();

    // addStudent()

    const student = await prisma.student.create({
      data: {
        name: name,
        id_card: idCardURL,
        email: email,
        phone: phone,
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
    })
    .catch(err=>{
      return res.json({
        success:false,
        msg:err,
      })
    });

    if(!process.env.JWT_SECRET_KEY){
      throw new Error("JWT secret not found")
    }

    const token = jwt.sign(
      //@ts-ignore
      { email: email, id: student.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      succes: true,
      data: student,
      token: token,
      msg: "User Successfully created",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      succes: false,
      msg: "Internal Server error",
    });
  }
};

const login = async (req:Request, res:Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        success: false,
        msg: "Please provide all details",
      });
    }

    const existingUser = await prisma.student.findFirst({
      where: { email: email },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        msg: "User does not exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    if(!process.env.JWT_SECRET_KEY){
      throw new Error("JWT secret not found")
    }


    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser.id,
      },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).json({
      success: true,
      msg: "login success",
      data: existingUser,
      token: token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const updateStudent = async (req:Request, res:Response) => {
  try {
    const { id: _id } = req.params;
    const studentData = req.body;

    if (!_id || !studentData) {
      return res.status(404).json({
        success: false,
        msg: "please provide student details",
      });
    }

    const student = await prisma.student.findFirst({
      where: {
        id: _id,
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        msg: "No student found",
      });
    } else {
      const student = await prisma.student.update({
        where: {
          id: _id,
        },
        data: studentData,
      });

      console.log(student);

      return res.status(200).json({
        success: true,
        msg: "Student data updated successfully",
        data: student,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const getStudents = async (req:Request, res:Response) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        interviews: true,
      },
    });

    if (!students) {
      return res.status(404).json({
        success: false,
        msg: "Not any student found please singup",
      });
    }

    console.log(students);

    return res.status(200).json({
      success: true,
      msg: "All students data fetched successfully",
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const deleteStudent = async (req:Request, res:Response) => {
  try {
    const { id: _id } = req.params;

    if (!_id) {
      return res.status(400).json({
        success: false,
        msg: "Please provide id",
      });
    }

    const student = await prisma.student.delete({
      where: {
        id: _id,
      },
    });

    return res.status(200).json({
      success: true,
      msg: "Student deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const uploadResume = async (req:Request, res:Response) => {
  try {
    const resume = req.file;
    const { id: _id } = req.params;
    console.log(req.file);

    if (!resume) {
      return res.status(404).json({
        success: false,
        msg: "please provide resume file",
      });
    }

    

    const getResumeURL = async () => {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `student/resume/${resume.originalname}`,
        Body: resume.buffer,
        ContentType: resume.mimetype,
      });
      await s3client.send(command);

      const getObjectCmd = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `student/resume/${resume.originalname}`,
      });

      const url = await getSignedUrl(s3client, getObjectCmd, {
        expiresIn: 60 * 60 * 24 * 7, //one week
      });
      return url;
    };

    const resumeURL = await getResumeURL();

    const updatedStudent = await prisma.student.update({
      where: {
        id: _id,
      },
      data: {
        resume: resumeURL,
      },
    });

    return res.status(200).json({
      success: true,
      msg: "Success",
      data: updatedStudent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server errors",
    });
  }
};

const uploadID = async (req:Request, res:Response) => {
  try {
    console.log(req.file);

    return res.status(200).json({
      success: true,
      msg: "Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server errors",
    });
  }
};

const getStudentInfo = async (req:Request, res:Response) => {
  try {
    const { id: _id } = req.params;
    const { filter } = req.query;

    if (filter === "today") {
      const date = new Date();
      const interview = await prisma.interview.findMany({
        where: {
          date: date,
          studentId: _id,
        },
      });

      if (!interview) {
        return res.status(404).json({
          success: false,
          msg: "No interview found",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Interview fetched successfully",
        data: interview,
      });
    }

    if (filter === "upcoming") {
      const upcomingDay = new Date();
      upcomingDay.setDate(upcomingDay.getDate() + 1);

      const upcomingInterview = await prisma.interview.findMany({
        where: {
          date: {
            gt: upcomingDay,
          },
          studentId: _id,
        },
      });

      if (!upcomingInterview) {
        return res.status(404).json({
          success: false,
          msg: "No upcoming interview found",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Upcoming interview fetched successfully",
        data: upcomingInterview,
      });
    }

    if (filter === "previous") {
      const previousDay = new Date();
      previousDay.setDate(previousDay.getDate() - 1);

      const previousInterview = await prisma.interview.findMany({
        where: {
          date: {
            lt: previousDay,
          },
          studentId: _id,
        },
      });

      if (!previousInterview) {
        return res.status(404).json({
          success: false,
          msg: "No previous interview",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Previous interview fetched successfully",
        data: previousInterview,
      });
    }
    const student = await prisma.student.findFirst({
      where: {
        id: _id,
      },
    });
    if (!student) {
      return res.status(404).json({
        success: false,
        msg: "Not existing Student found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Student info fetched successfully",
      data: student,
    });
  } catch (error) {
    console.log("THe err is " + error);
    return res.status(500).json({
      // console.log(error),
      success: false,
      msg: "Internal Server error",
    });
  }
};

export {
  login,
  signUp,
  updateStudent,
  deleteStudent,
  getStudents,
  uploadResume,
  uploadID,
  getStudentInfo,
};
