import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Hello World 1123");
});
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port: ", PORT);
});

