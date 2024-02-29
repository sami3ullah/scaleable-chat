import http from "http";

const init = async () => {
  const httpServer = http.createServer();
  const PORT = process.env.PORT || 8000;

  httpServer.listen(PORT, () => {
    console.log(`HTTP server started at PORT: ${PORT}`);
  });
};

init();
