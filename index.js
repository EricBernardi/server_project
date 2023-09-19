import jsonwebtoken from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";
import DB from "./db.js";
import User from "./Models/User.js";
import Course from "./Models/Course.js";
import dotenv from "dotenv";

dotenv.config();
const server = express();
const port = 3000;
let users = new Array() < User > [];
let courses = new Array() < Course > [];

const database = new DB();

function insertUser() {
  const password = "123";
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      console.error("Erro ao criar o hash da senha:", err);
    } else {
      database
        .setUsers({ username: "fire", login_user: "fire", password: hash })
        .then((res, err) => {
          console.log(res);
        });
    }
  });
}

// insertUser();

async function getUsers() {
  return database.getUsers().then((response, err) => {
    if (err) return `Error: ${err}`;
    return response;
  });
}

async function insertCourses(course) {
  try {
    const result = await database.setCourses(course);
    if (result) return { ok: true };
  } catch (error) {
    console.error({ "Erro no curso": error });
    throw new Error(error);
  }
}

async function getCourses() {
  return database.getCourses().then((response, err) => {
    if (err) return `Error: ${err}`;
    console.log(response);
    return response;
  });
}

getCourses();

server.use(express.json());

server.use((req, res, next) => {
  if (req.headers.origin === "http://localhost:3001") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

server.post("/login", async (req, res) => {
  const username = req.body.credentials.username;
  const password = req.body.credentials.password;
  const saltRounds = 10;
  // var hashPassword = "";

  // Método usado para criptografar a senha

  // Método usado para criptografar a senha
  // bcrypt.hash(password, saltRounds, function(err, hash) {
  //   if(err) {
  //     console.error('Erro ao criar o hash da senha:', err);
  //   } else {
  //     hashPassword = hash;
  //   }
  // })

  try {
    let users = await getUsers();

    const user = users.filter((user) => {
      return user.login_user == username;
    });
    console.log(user[0]);
    bcrypt.compare(password, user[0].password, function (err, result) {
      if (err) {
        console.log("Erro ao comparar as senhas: ", err);
        return res.status(500).send("Ocorreu um erro", err);
      } else {
        if (username === user[0].login_user && result) {
          const token = jsonwebtoken.sign(
            { user: JSON.stringify(username) },
            process.env.KEY_TO_ENCRYPT_PASSWORDS,
            { expiresIn: "60m" }
          );
          console.log(token);
          return res.status(200).json({ data: { username, token } });
        } else {
          return res.status(401).send("Usuário ou senha incorretos!");
        }
      }
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

server.get("/", (req, res) => {
  try {
    return res.send(`Servidor está rodando...`);
  } catch (err) {
    return res.send(err);
  }
});

server.get("/cursos/:index", async (req, res) => {
  const { index } = req.params;
  const cursos = await getCourses();

  return res.json(cursos[index == 0 ? index : index - 1]);
});

server.get("/cursos", async (req, res) => {
  const cursos = await getCourses();
  return res.json(cursos);
});

server.post("/cursos", async (req, res) => {
  const response = await insertCourses(req.body.data);
  console.log(response);
  return res.json(response);
});

server.put("/cursos/:index", (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  cursos[index] = name;

  return res.json(cursos);
});

server.delete("/cursos/:index", (req, res) => {
  const { index } = req.params;
  const message = `O Curso de ${cursos[index]} foi deletado com sucesso!`;
  cursos.splice(index, 1);
  return res.json({ message: message });
});

server.listen(port, () => {
  console.log(
    `Servidor está rodando na porta ${port}... http://localhost:3000`
  );
});
