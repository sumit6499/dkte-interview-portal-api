import express,{Request,Response,NextFunction} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import connect from "./src/setup/databse.ts";
import studentAuth from "./src/routes/auth/studentAuth.ts";
import adminAuth from "./src/routes/auth/adminAuth.ts";
import interviewerAuth from "./src/routes/auth/interviewerAuth.ts";
import studentRoutes from "./src/routes/studentRoutes.ts";
import adminRoutes from "./src/routes/adminRoutes.ts";
import interviewRoutes from "./src/routes/interviewRoutes.ts";
import paymentRoutes from "./src/routes/paymentRoutes.ts";
import sendInterviewNotification from "./src/feat/mail.ts";
import interviewerRoutes from "./src/routes/interviewerRoutes.ts";

const prisma = new PrismaClient();
dotenv.config();

const app = express();
const PORT:number = 3000 || process.env.PORT;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json({ limit: "30mb" }));
app.use(cookieParser());

app.use((req:Request, res:Response, next:NextFunction) => {
  console.log(
    "http method=>" + `${req.method} -> ${req.originalUrl} ->` + Date.now()
  );
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
app.use("/api/v1/auth/interviewer", interviewerRoutes);

//database connect
connect();



app.get("/", async (req:Request, res:Response) => {


  return res.status(200).json({
    success: true,
    msg: "Hello from server",
  });
});

app.listen(PORT, () => {
  console.log("server running on port 3000");
});
