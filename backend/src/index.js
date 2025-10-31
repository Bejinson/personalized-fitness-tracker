import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "https://personalized-fitness-tracker-frontend.onrender.com", // ✅ Your frontend domain
      "http://localhost:5173" // optional, for local testing
    ],
    credentials: true,
  })
);

app.use(express.json());

// Your routes...
import authRoutes from "./routes/auth.js";
app.use("/api/auth", authRoutes);

// Connect DB and start server
connectDB();
app.listen(process.env.PORT || 4000, () => {
  console.log(`✅ Server running on port ${process.env.PORT || 4000}`);
});
