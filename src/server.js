
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

dns.setServers(["8.8.8.8"]);

const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);
app.use(helmet());
const PORT = process.env.PORT || 3000;
// app.get("/", (req, res) => {
//   console.log("Main page");

//   res.status(200).json({
// 	"message": "Retrieved all notes"
// }
// );
// });
// app.get("/notes", (req,res) => {
//   console.log("Notes page");
//   res.status(200).json({
//     "message": "Retrieved all notes"
//   }
//   );
// });

// app.get('/notes/:noteId', (req, res) => {
//   const { noteId } = req.params;
//   res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
// });
app.use(notesRoutes);

// app.get('/test-error', () => {
//   throw new Error('Simulated server error');
// });

app.use(notFoundHandler);

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
