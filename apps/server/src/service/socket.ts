import { Server } from "socket.io";

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
  }

  // Hanlding Socket Events
  public initListeners() {
    console.log("Initialize Socket Listeners...");
    const io = this._io;
    io.on("connect", (socket) => {
      console.log("New Socket Connected!", socket.id);

      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Received: ", message);
      });
    });
  }

  // Getter Method
  get io() {
    return this._io;
  }
}

export default SocketService;
