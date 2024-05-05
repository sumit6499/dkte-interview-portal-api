import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
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
  console.log("http method=>" + `${req.method} ` + Date.now());
  next();
});

//student routes
app.use("/students", studentRoutes);
app.use("/admin", adminRoutes);

const main = async () => {
  try {


    const students = await prisma.student.findMany({
      include: {
        interviews: true,
      },
    });

    console.log(students[0]);

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
