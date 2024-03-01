import http from "http";
import SocketService from "./services/socket";
import { startMessageConsumer } from "./services/kafka";

const init = async () => {
  // starting kafka consumer
  startMessageConsumer();
  const httpServer = http.createServer();
  const socketService = new SocketService();
  const PORT = process.env.PORT || 8000;

  //   attaching socket service to http server
  socketService.io.attach(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`HTTP server started at PORT: ${PORT}`);
  });

  socketService.initListeners();
};

init();
