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
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const signUp = async (req, res) => {
  const { name, email, phone, freeday, startTime, endTime, password } =
    req.body;
  const idCard = req.file;
  try {
    if (
      !name ||
      !freeday ||
      !password ||
      !phone ||
      !email ||
      !startTime ||
      !endTime ||
      !idCard
    ) {
      return res.status(400).json({
        succes: false,
        msg: "Please provide all details",
      });
    }

    const existingUser = await prisma.interviewer.findFirst({
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

    const getIdCardURL = async () => {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `interviewer/idCard/${idCard.originalname}`,
        Body: idCard.buffer,
        ContentType: idCard.mimetype,
      });

      await s3client.send(command);

      const getObjectCmd = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `interviewer/idCard/${idCard.originalname}`,
      });

      const url = await getSignedUrl(s3client, getObjectCmd, {
        expiresIn: 60 * 60 * 24 * 7,
      });
      return url;
    };

    const idCardURL = await getIdCardURL();

    const interviewer = await prisma.interviewer.create({
      data: {
        name: name,
        email: email,
        phone: phone,
        freeday: freeday,
        startTime: startTime,
        endTime: endTime,
        password: encryptedPassword,
        id_card: idCardURL,
      },
    });

    const token = jwt.sign(
      { email: interviewer.email, id: interviewer.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      succes: true,
      data: interviewer,
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

    const existingUser = await prisma.interviewer.findFirst({
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
const getInterviewers = async (req, res) => {
  try {
    console.log(req.params);
    const { day: day } = await req.params;
    console.log("THe day si ", day);
    const interviewers = await prisma.interviewer.findMany({
      where: {
        freeday: day,
      },
    });
    console.log("the itnerivwers are" + interviewers);
    if (!interviewers) {
      return res.status(404).json({
        success: false,
        msg: "Not any interviewer found ",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "All interviewers data fetched successfully",
      data: interviewers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

const updateInterviewerInfo = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const  interviewerData  = req.body;
    console.log("the req os",req.body)
console.log("TYje data here uis ",interviewerData)
    if (!interviewerData) {
      return res.status(401).json({
        success: false,
        msg: "Please provide details",
      });
    }

    const existingUser = await prisma.interviewer.findFirst({
      where: {
        id: _id,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        msg: "Interviewer not found",
      });
    }

    const updatedInterviewer = await prisma.interviewer.update({
      where: {
        id: _id,
      },
      data: interviewerData,
    });

    return res.status(200).json({
      success: true,
      msg: "Interviewer details updated successfully",
      data: updatedInterviewer,
    });
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        msg: "Internal Server error",
      });
    }
  }
};
const uploadIDcard = async (req, res) => {
  try {
    const id_card = req.file;
    const { id: _id } = req.params;
    console.log(req.file);

    if (!id_card) {
      return res.status(404).json({
        success: false,
        msg: "please provide resume file",
      });
    }

    const getIdCardURL = async () => {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `interviewer/id_card/${id_card.originalname}`,
        Body: id_card.buffer,
        ContentType: id_card.mimetype,
      });
      await s3client.send(command);

      const getObjectCmd = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `interviewer/idCard/${id_card.originalname}`,
      });

      const url = await getSignedUrl(s3client, getObjectCmd, {
        expiresIn: 60 * 60 * 24 * 7, //one week
      });
      return url;
    };

    const idCardURL = await getIdCardURL();

    const updatedInterviewer = await prisma.interviewer.update({
      where: {
        id: _id,
      },
      data: {
        id_card: idCardURL,
      },
    });

    return res.status(200).json({
      success: true,
      msg: "Success",
      data: updatedInterviewer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Internal server errors",
    });
  }
};

export { login, signUp, getInterviewers, updateInterviewerInfo, uploadIDcard };

