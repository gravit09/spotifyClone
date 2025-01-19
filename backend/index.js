import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import connectDb from "./db/index.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

import userRouter from "./routes/user.routes.js";
app.use("/api/auth", userRouter);

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
