import express,{Request,Response} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {logger} from './middleware/logger'
import connect from "./setup/databse";
import studentAuth from "./routes/auth/studentAuth";
import adminAuth from "./routes/auth/adminAuth";
import interviewerAuth from "./routes/auth/interviewerAuth";
import studentRoutes from "./routes/studentRoutes";
import adminRoutes from "./routes/adminRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import interviewerRoutes from "./routes/interviewerRoutes";
import limiter from "./middleware/rateLimiter";

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

app.use(logger);
app.use(limiter);

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
connect()


app.get("/", async (req:Request, res:Response) => {
  return res.status(200).json({
    success: true,
    msg: "Hello from server",
  });
});

app.listen(PORT, () => {
  console.log("server running on port 3000");
});
