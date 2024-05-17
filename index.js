import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import connect from "./src/setup/databse.js";
import studentAuth from "./src/routes/auth/studentAuth.js";
import adminAuth from "./src/routes/auth/adminAuth.js";
import interviewerAuth from "./src/routes/auth/interviewerAuth.js";
import studentRoutes from "./src/routes/studentRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import interviewRoutes from "./src/routes/interviewRoutes.js";
import paymentRoutes from './src/routes/paymentRoutes.js'

const prisma = new PrismaClient();
dotenv.config();

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json({ limit: "30mb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("http method=>" + `${req.method} -> ${req.originalUrl} ->` + Date.now());
  next();
});

//Auth routes
app.use("/students", studentAuth);
app.use("/admin", adminAuth);
app.use("/interviewer", interviewerAuth);

//api routes
app.use("/api/v1/auth/students", studentRoutes);
app.use("/api/v1/auth/admin", adminRoutes);
app.use("/api/v1/auth/interview", interviewRoutes);

//database connect
connect();

const main = async () => {
  try {
    const student = await prisma.interviewer.deleteMany();

    // const interview=await prisma.interview.deleteMany()
    // console.log(interview)

    console.log(student);
  } catch (error) {
    console.log(error);
  }
};

// main();

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    msg: "Hello from server",
  });
});

app.listen(PORT, () => {
  console.log("server running on port 3000");
});
