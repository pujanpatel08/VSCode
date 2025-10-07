import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Express API running 🚀" });
});

app.listen(PORT, () => {
  console.log(`✅ Express API listening on port ${PORT}`);
});
