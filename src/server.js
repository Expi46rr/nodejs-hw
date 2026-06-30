// import path from 'node:path';
import express from "express";
// const notePath = path.join("a", "b", "c");
import cors from "cors";
import pino from 'pino-http';
import helmet from "helmet";
import 'dotenv/config';
const app = express();
app.use(express.json());
app.use(cors());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);
app.use(helmet());




app.get("/", (req, res) => {
  console.log("Main page");

  res.status(200).json({
	"message": "Retrieved all notes"
}
);
});
app.get("/notes", (req,res) => {
  console.log("Notes page");
  res.status(200).json({
    "message": "Retrieved all notes"
  }
  );
});


app.get("/notes/:noteId", (req, res) => {
  console.log("Notes id page");
  res.status(200).json({
    "message": "Retrieved note with ID: id_param"
  }
  );
});



app.use((err, req, res, next) => {
  console.error('Error:', err.message);

const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    message: isProd ? "Oops something wrong" : err.message


  });
});


app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
