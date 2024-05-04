import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(
  cors({
    origin: true,
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

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    msg: "Hello from server",
  });
});

app.listen(PORT, () => {
  console.log("server running on port 3000");
});
