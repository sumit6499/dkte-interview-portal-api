import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

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

const signUp = async (req, res) => {
  const { id_card, name, dept, phone, email, password } = req.body;
  try {
    if (!id_card || !name || !dept || !email || !password) {
      return res.status(400).json({
        succes: false,
        msg: "Please provide all details",
      });
    }

    const existingUser = await prisma.faculty.findFirst({
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

    const faculty = await prisma.faculty.create({
      data: {
        name: name,
        id_card: id_card,
        dept: dept,
        phone: phone,
        email: email,
        password: encryptedPassword,
      },
    });

    const token = jwt.sign(
      { email: faculty.email, id: faculty.id },
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

const updateAdmin = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const adminData = req.body;

    if (!id || !adminData) {
      return res.status(404).json({
        success: false,
        msg: "please provide faculty details",
      });
    }

    const faculty = await prisma.faculty.findFirst({
      where: {
        id: _id,
      },
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        msg: "No faculty found",
      });
    } else {
      const faculty = await prisma.faculty.update({
        where: {
          id: id,
        },
        data: adminData,
      });
      console.log(faculty);

      return res.status(200).json({
        success: true,
        msg: "faculty data updated successfully",
        data: faculty,
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

export { login, signUp,updateAdmin };
