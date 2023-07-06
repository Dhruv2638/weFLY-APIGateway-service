const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const { ServerConfig, Logger } = require("./config/index.js");
const apiRoutes = require("./routes/index.js");

const rateLimit = require("express-rate-limit");
const serverConfig = require("./config/server-config.js");

const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 3, // Limit each IP to 3 requests per `window` (here, per 15 minutes)
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/filghtsService",
  createProxyMiddleware({
    target: serverConfig.FLIGHT_SERVICE,
    changeOrigin: true,
  })
);

app.use(
  "/bookingService",
  createProxyMiddleware({
    target: serverConfig.BOOKING_SERVICE,
    changeOrigin: true,
  })
);

app.use(limiter);
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`successfully server started on port: ${ServerConfig.PORT}`);
  Logger.info("successfully started the server", "root", {});
});
