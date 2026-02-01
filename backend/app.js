import express from "express";
import cors from "cors";

import authRoutes from "./routes/authroutes.js";
import petRoutes from "./routes/petRoutes.js";
import ngoRoutes from "./routes/ngoRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/donations", donationRoutes);

export default app;
