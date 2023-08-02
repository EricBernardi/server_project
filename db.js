import mysql from "mysql";
import dotenv from 'dotenv';

dotenv.config();

class DB {
  constructor() {
    this.con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: process.env.DATABASE_PASSWORD,
        database: "users",
      });
  }

  handleDisconnect() {
    con.connect((err) => {
      if (err) {
        console.error("error when connecting to db:", err);
        setTimeout(handleDisconnect, 2000);
      }
    });

    con.on("error", (err) => {
      console.error("db error", err);
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        handleDisconnect();
      } else {
        throw err;
      }
    });
  }
}

export default DB;
