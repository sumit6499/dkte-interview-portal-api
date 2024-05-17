import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

const s3client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const signUp = async (req, res) => {
  const { name, prn, email, password, phone, dept, transID } = req.body;

  const resume = req.files["idCard"][0];
  const idCard = req.files["resume"][0];
  const paymentImg = req.files["paymentImg"][0];

  try {
    if (
      !name ||
      !prn ||
      !password ||
      !phone ||
      !email ||
      !dept ||
      !idCard ||
      !resume ||
      !transID ||
      !paymentImg
    ) {
      return res.status(400).json({
        succes: false,
        msg: "Please provide all details",
      });
    }

    // console.log(idCard,resume)

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

      const url = await getSignedUrl(s3client, getObjectCmd);
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

      const url = await getSignedUrl(s3client, getObjectCmd);
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

      const url = await getSignedUrl(s3client, getObjectCmd);
      return url;
    };

    const resumeURL = await getResumeURL();

    const idCardURL = await getIdCardURL();

    const paymentImgURL = await getPaymentImgURL();

    const student = await prisma.student.create({
      data: {
        name: name,
        id_card: idCardURL,
        email: email,
        phone: phone,
        dept: dept,
        PRN: prn,
        password: encryptedPassword,
        resume: resumeURL,
        Payment: {
          create: {
            transactionId: transID,
            image: paymentImgURL,
          },
        },
      },
    });

    const token = jwt.sign(
      { email: student.email, id: student.id },
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

const login = async (req, res) => {
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

const updateStudent = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const studentData = req.body;

    if (!id || !studentData) {
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

const getStudent = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        interviews: true,
      },
    });

    console.log(students);

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id: _id } = req.params;

    if (!id) {
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

const uploadResume = async (req, res) => {
  try {
    const { name, prn, email, password, phone, dept } = req.body;
    console.log(name, prn, email, password, dept, phone);
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

const uploadID = async (req, res) => {
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

export {
  login,
  signUp,
  updateStudent,
  deleteStudent,
  getStudent,
  uploadResume,
  uploadID,
};
