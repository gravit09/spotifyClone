import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDb from "./db/index.js";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url"; // Imported this because __dirname is only available on commonjs

const __filename = fileURLToPath(import.meta.url); // Current file's path
const __dirname = path.dirname(__filename); // Directory name of the current file

const app = express();
app.use(bodyParser.json());
app.use(cors());

import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
app.use("/api/auth", userRouter);
app.use("/api/admin", adminRouter);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits: {
      fileSize: 15 * 1024 * 1024, // 15 MB max file size
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

connectDb()
  .then(() => {
    app.listen(3000, () => {
      console.log("application is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error while connecting to db", err);
  });
