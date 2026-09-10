const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const comentarios = [];

app.get("/comentarios", (req, res) => {
    res.json(comentarios);
});

app.post("/comentarios", (req, res) => {
    const { comentario } = req.body;

    comentarios.push(comentario);

    res.json({
        mensagem: "Comentário salvo"
    });
});

app.listen(8081, () => {
    console.log("Servidor rodando em http://localhost:8081");
});