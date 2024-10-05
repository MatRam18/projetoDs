const express = require('express')
const server = express()
const usuario = require("./src/teste.json")
const tarefa = require("./src/test1.json")

server.get("/", (req, res) =>{
    return res.json({mensagem: "Hello Node"})
})

server.get("/tarefa", (req, res) =>{
    return res.json(tarefa)
})

server.get("/usuario", (req, res)=>{
    return res.json(usuario)
})

server.listen(3300, ()=> {
    console.log('server ON')
})
