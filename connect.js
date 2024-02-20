const mongoose = require("mongoose");

let connectMDB = null;

const connectMongo = async () => {
  if (connectMDB) return connectMDB;
  return mongoose.connect(process.env.MONGODB_URI + "/calendar");
};

module.exports = connectMongo;
