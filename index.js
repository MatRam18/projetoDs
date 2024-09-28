const express = require('express')
const server = express()
const alunos = require("./src/teste.json")

server.get("/", (req, res) =>{
    return res.json({mensagem: "Hello Node"})
})

server.get("/soul", (req, res) =>{
    return res.json({mensagem: "Pneu furou? Meu pau é um anzol"})
})

server.get("/alunos", (req, res)=>{
    return res.json(alunos)
})

server.listen(3300, ()=> {
    console.log('server ON')
})
