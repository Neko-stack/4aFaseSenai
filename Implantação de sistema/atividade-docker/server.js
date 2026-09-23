const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.json({
        mensagem: "Oi do Docker!!"
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});