import http from "http";

import SocketService from "./service/socket";

import { startMessageConsumer } from "./service/kafka";

async function init() {
  startMessageConsumer();
  
  const socketService = new SocketService();

  const httpServer = http.createServer();
  const PORT = process.env.DEVPORT ? process.env.DEVPORT : 8000;

  socketService.io.attach(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  socketService.initListeners();
}

init();
