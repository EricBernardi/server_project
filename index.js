import jsonwebtoken from "jsonwebtoken";
import express from "express";
import bcrypt, { hash } from "bcrypt";
import e from "express";

const server = express();
const port = 3000;
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
    const hashFromDatabase =
      "$2b$10$G4gvOGYTVXf0CXJyZt9s6.6jWlCtcsY/lHbmFVnDzb1KUdXN17m56";

    bcrypt.compare(password, hashFromDatabase, function (err, result) {
      if (err) {
        console.log("Erro ao comparar as senhas: ", err);
        return res.status(500).send("Ocorreu um erro", err);
      } else {
        if (username === "Teste" && result) {
          const token = jsonwebtoken.sign(
            { user: JSON.stringify(username) },
            "hgs%4$54!@#ASD",
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

// server.use("*", auth.tokenValited);

const cursos = [
  {
    id: 1,
    curso: "Java",
    detalhes:
      "Java é uma linguagem de programação e plataforma de computação liberada pela primeira vez pela Sun Microsystems em 1995. De um início humilde, ela evoluiu para uma grande participação no mundo digital dos dias atuais, oferecendo a plataforma confiável na qual muitos serviços e aplicativos são desenvolvidos.",
  },
  {
    id: 2,
    curso: "C#",
    detalhes:
      "C# é uma linguagem de programação orientada a objetos e orientada a componentes. C# fornece construções de linguagem para dar suporte diretamente a esses conceitos, tornando C# uma linguagem natural para criação e uso de componentes de software.",
  },
  {
    id: 3,
    curso: "PHP",
    detalhes:
      "O PHP (um acrônimo recursivo para PHP: Hypertext Preprocessor ) é uma linguagem de script open source de uso geral, muito utilizada, e especialmente adequada para o desenvolvimento web e que pode ser embutida dentro do HTML.",
  },
];

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
  console.log(`Servidor está rodando na porta ${port}...`);
});
