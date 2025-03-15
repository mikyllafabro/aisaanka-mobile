import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;
const IP = process.env.IP;

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/review", reviewRoutes);

// ✅ Connect to MongoDB and Log 

app.listen(PORT, IP, () => {
    console.log(`Server is running on http://${IP}:${PORT}`);
});
