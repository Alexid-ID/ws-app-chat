//TODO:chia main quản lý tác vụ trước sau , các phụ thuộc endpoint dễ nhìn hơn
const AccountRoute = require("./AccountRoute");
const ProductRoute = require("./ProductRoute");
const OrderRoute = require("./orderRoute");
const connect = require("../config/db/index");
const checkUser = require("../app/middleware/checkUser");

const router = (app) => {
  //connect Mongo
  connect.connect();
  app.use("/api/account",AccountRoute);
  app.use("/api/products", ProductRoute);
  app.use("/api/orders",checkUser, OrderRoute);
};

module.exports = router;
