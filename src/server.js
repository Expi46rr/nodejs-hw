
import express from "express";
import cors from "cors";
import helmet from "helmet";
import 'dotenv/config';
import { connectMongoDB } from "./db/connectMongoDB.js";
import dns from "node:dns";
// import { Note } from "./models/note.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import notesRoutes from "./routes/notesRoutes.js";
import { errors } from "celebrate";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

dns.setServers(["8.8.8.8"]);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(logger);
app.use(helmet());
const PORT = process.env.PORT || 3000;

app.use(notesRoutes);
app.use(authRoutes);
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
