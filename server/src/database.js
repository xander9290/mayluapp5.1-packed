import mongoose from "mongoose";
const { connect } = mongoose;

const MONGODB_URI = "mongodb://127.0.0.1:27017/maylu";

(async () => {
  try {
    const db = await connect(MONGODB_URI);
    console.log(`Base de datos conectada en ${db.connection.name}`);
  } catch (error) {
    console.log(error);
  }
})();
