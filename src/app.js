// src/app.js
import express from "express";
import dotenv from "dotenv";
import tokenRoutes from "./routes/tokenRoutes.js";
import { envPORT } from "./libs/globalEnvs.js";

dotenv.config();

const app = express();
const PORT = envPORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/api", tokenRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
