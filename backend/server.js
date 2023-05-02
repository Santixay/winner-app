const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

mongoose.set("strictQuery", true);

// Custom import
const customerRoutes = require("./routes/customer.js");
const packageRoutes = require("./routes/package.js");
const userRoutes = require("./routes/user.js");
const locationRoutes = require("./routes/location.js");
const routeRoutes = require("./routes/route.js");
const stationRoute = require("./routes/station.js");
const trackingLogRoutes = require("./routes/trackingLog.js");
// const whatappApiRoutes = require("./routes/whatsappApi.js");
const roleRoutes = require("./routes/role.js");
const apilinkRoutes = require("./routes/apilink.js");
const publicRoutes = require("./routes/public.js");
const accountRoutes = require("./routes/account.js");
const transactionRoutes = require("./routes/transaction.js");

// Middlewares
const { authen } = require("./middleware/authenticate.js");
const { checkPermission } = require("./middleware/checkPermission.js");

var app = express();
app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/api/customer", authen, checkPermission, customerRoutes);
app.use("/api/package", authen, checkPermission, packageRoutes);
app.use("/api/user", authen, checkPermission, userRoutes);
app.use("/api/location", authen, checkPermission, locationRoutes);
app.use("/api/route", authen, checkPermission, routeRoutes);
app.use("/api/station", authen, checkPermission, stationRoute);
app.use("/api/trackinglog", authen, checkPermission, trackingLogRoutes);
// app.use("/api/whatsapp", authen, checkPermission, whatappApiRoutes);
app.use("/api/role", authen, checkPermission, roleRoutes);
app.use("/api/apilink", authen, checkPermission, apilinkRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/transaction", transactionRoutes);

/* PUBLIC ROUTES */
app.use("/api/public", publicRoutes);

// Serve frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./build")));
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => res.send("Please set NODE_ENV to production"));
}

const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`CORS-enabled web server listening on port: ${PORT}`);   
    });
  })
  .catch((error) => console.log(`${error} did not connect`));
