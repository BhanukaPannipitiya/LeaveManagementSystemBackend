import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: '*',  // Allows CORS from any origin
    credentials: true
}));


app.get("/", (req, res) => {
    res.send("Hello World 1123");
});
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port: ", PORT);
});

