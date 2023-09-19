import mysql from "mysql2";
import dotenv from "dotenv";
import { DataTypes, Sequelize } from "sequelize";

dotenv.config();

class DB {
  constructor() {
    this.sequelize = new Sequelize(
      "users",
      "root",
      process.env.DATABASE_PASSWORD,
      {
        host: "localhost",
        dialect: "mysql",
      }
    );
    this.con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.DATABASE_PASSWORD,
      database: "users",
    });

    // this.User = this.sequelize.define('User')
    const Course = this.sequelize.define("courses", {
      course_name: {
        type: DataTypes.STRING,
      },
      course_detail: {
        type: DataTypes.TEXT("long"),
      },
    });

    this.course = Course;

    Course.sync()
      .then((value) => {
        console.log(value);
      })
      .catch((err) => console.log(err));
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

  async getUsers() {
    return new Promise((resolve, reject) => {
      this.con.query("SELECT * FROM user_login", (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  async setUsers(user) {
    return new Promise((resolve, reject) => {
      this.sql = `INSERT INTO user_login (id, username, login_user, password) VALUES ("${4}", "${
        user.username
      }", "${user.login_user}", "${user.password}")`;
      this.con.query(this.sql, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  async getCourses() {
    return new Promise((resolve, reject) => {
      this.con.query("SELECT * FROM courses", (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  async setCourses(course) {
    const courseCreated = await this.course.create({
      course_name: course.courseName,
      course_detail: course.courseDetail,
    });

    console.log(courseCreated);

    return courseCreated;
  }
}

export default DB;
