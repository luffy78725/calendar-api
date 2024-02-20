require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();
const eventsRouter = require("./routes");
const connectDB = require("./connect");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const meetingScheduler = require("./schedule-task");

const PORT = 8000;
app.use(express.json());

app.use("/api/v1", eventsRouter);

app.use("/", (req, res) => {
  res.send("Hello world!");
});

app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      meetingScheduler();
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
