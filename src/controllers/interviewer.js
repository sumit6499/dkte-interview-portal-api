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
        expiresIn: 60 * 60 * 24 * 365 * 10,
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

export { login, signUp };
