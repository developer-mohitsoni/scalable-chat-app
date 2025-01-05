import { Server } from "socket.io";

import "dotenv/config";

import Redis from "ioredis";
import prisma from "./prisma";

const pub = new Redis({
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.USER,
  password: process.env.PASSWORD,
});
const sub = new Redis({
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.USER,
  password: process.env.PASSWORD,
});

class SocketService {
  private _io: Server;
  constructor() {
    console.log("Init Socket Server...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  // Hanlding Socket Events
  public initListeners() {
    console.log("Initialize Socket Listeners...");
    const io = this._io;
    io.on("connect", (socket) => {
      console.log("New Socket Connected!", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Received: ", message);

        // publish this message to redis

        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        console.log("New Message Received from Redis: ", message);
        io.emit("message", message);

        await prisma.message.create({
          data: {
            text: message,
          },
        });
      }
    });
  }

  // Getter Method
  get io() {
    return this._io;
  }
}

export default SocketService;
