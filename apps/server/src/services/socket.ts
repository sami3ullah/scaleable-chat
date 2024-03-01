import { Server } from "socket.io";
import Redis from "ioredis";

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST ?? "",
  port: Number(process.env.REDIS_PORT) ?? 0,
  username: process.env.REDIS_USERNAME ?? "",
  password: process.env.REDIS_PASSWORD ?? "",
};

// pub/sub pattern
const pub = new Redis(REDIS_CONFIG);
const sub = new Redis(REDIS_CONFIG);

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Server");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    // subscribing to messages
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this._io;
    console.log("Init Socket Listeners...");
    io.on("connect", (socket) => {
      console.log(`New Socket Connected: ${socket.id}`);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Received", message);
        // publishing the message to the redis
        await pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        // emit the message to all the clients
        io.emit("message", message);
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
