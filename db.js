import mysql from "mysql2";
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
    this.con.connect((err) => {
      if (err) {
        console.error("error when connecting to db:", err);
        setTimeout(handleDisconnect, 2000);
      }
    });

    this.con.on("error", (err) => {
      console.error("db error", err);
      if (err.code === "PROTOCOL_CONNECTION_LOST") {
        handleDisconnect();
      } else {
        throw err;
      }
    });
  }

 async getUsers(){
    return new Promise((resolve, reject) => {
      this.con.query("SELECT * FROM user_login", (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  async getCourses(){
    return new Promise((resolve, reject) => {
      this.con.query("SELECT * FROM courses", (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    })
  }
}

export default DB;
