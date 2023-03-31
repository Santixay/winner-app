const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

// Custom import
const customerRoutes = require("./routes/customer.js");
const packageRoutes = require("./routes/package.js");
const userRoutes = require("./routes/user.js");
const locationRoutes = require("./routes/location.js");
const routeRoutes = require("./routes/route.js");
const stationRoute = require("./routes/station.js");
const trackingLogRoutes = require("./routes/trackingLog.js");
const whatappApiRoutes = require("./routes/whatsappApi.js");
const roleRoutes = require("./routes/role.js");
const apilinkRoutes = require("./routes/apilink.js");
const publicRoutes = require("./routes/public.js");

// Middlewares
const { authen } = require("./middleware/authenticate.js");
const { checkPermission } = require("./middleware/checkPermission.js");

var morgan = require("morgan");
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
app.use("/api/whatsapp", authen, checkPermission, whatappApiRoutes);
app.use("/api/role", authen, checkPermission, roleRoutes);
app.use("/api/apilink", authen, checkPermission, apilinkRoutes);

/* PUBLIC ROUTES */
app.use("/api/public", publicRoutes);

app.get("/", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`CORS-enabled web server listening on port: ${PORT}`)
    );
  })
  .catch((error) => console.log(`${error} did not connect`));
