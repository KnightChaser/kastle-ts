import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.SERVER_ACCESS_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_ACCESS_PORT}`);
});