import jsonwebtoken from "jsonwebtoken";
import express from "express";
import bcrypt from "bcrypt";
import DB from "./db.js";
import User from "./Models/User.js";
import Course from "./Models/Course.js";
import dotenv from 'dotenv';


dotenv.config();
const server = express();
const port = 3000;
let users = new Array<User>[];
let courses = new Array<Course>[];

const database = new DB();

database.getUsers().then((response) => {
  users = response;
});
database.getCourses().then((response) => {
  courses = response;
  console.log(courses);
});

server.use(express.json());

server.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  next();
});

server.post("/login", (req, res) => {
  const username = req.body.credentials.username;
  const password = req.body.credentials.password;
  const saltRounds = 10;
  let hashPassword = "";

  // Método usado para criptografar a senha
  // bcrypt.hash(password, saltRounds, function(err, hash) {
  //   if(err) {
  //     console.error('Erro ao criar o hash da senha:', err);
  //   } else {
  //     hashPassword = hash;
  //   }
  // })

  try {
    bcrypt.compare(password, hashPassword, function (err, result) {
      if (err) {
        console.log("Erro ao comparar as senhas: ", err);
        return res.status(500).send("Ocorreu um erro", err);
      } else {
        if (username === "Teste" && result) {
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

server.get("/cursos/:index", (req, res) => {
  const { index } = req.params;

  return res.json(cursos[index == 0 ? index : index - 1]);
});

server.get("/cursos", (req, res) => {
  return res.json(cursos);
});

server.post("/cursos", (req, res) => {
  const name = req.body.data;
  const idCurso = cursos.length + 1;
  cursos.push({ id: idCurso, curso: name });

  return res.json(cursos);
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
