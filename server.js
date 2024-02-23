require("express-async-errors");
require("dotenv").config();
const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const eventsRouter = require("./routes");
const connectDB = require("./connect");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const meetingScheduler = require("./schedule-task");

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("client connected");
  ws.on("message", (message) => {
    console.log(`Recieved Message ${message}`);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        console.log("inside foreach");
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

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
    server.listen(PORT, () => {
      meetingScheduler(wss);
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
