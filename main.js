const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

//### Configuração do Express e do Banco de Dados ###
const rotas = express();
const sequelize = new Sequelize("events", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

//### Definição dos Modelos ###
const Usuario = sequelize.define("usuario", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING },
  cpf: { type: DataTypes.STRING, unique: true },
  setor: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true, validate: { isEmail: true } },
  senha: { type: DataTypes.STRING },
}, {
  hooks: {
      beforeCreate: async (usuario) => {
          usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
  }
});

const Relatorio = sequelize.define("relatorio", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  finalidade: { type: DataTypes.STRING },
  data: { type: DataTypes.DATE },
  descricao: { type: DataTypes.TEXT },
  componentes: { type: DataTypes.TEXT },
});

const Tarefa = sequelize.define("tarefa", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING },
  descricao: { type: DataTypes.TEXT },
  data: { type: DataTypes.DATE },
  responsaveis: { type: DataTypes.STRING }, // Consider making this a foreign key reference to Usuario
  setor: { type: DataTypes.STRING },
  relatorioId: {
      type: DataTypes.INTEGER,
      references: { model: Relatorio, key: 'id' },
  },
});

Relatorio.hasMany(Tarefa, { foreignKey: 'relatorioId' });
Tarefa.belongsTo(Relatorio, { foreignKey: 'relatorioId' });

const syncModels = async () => {
  try {
      await sequelize.authenticate();
      await sequelize.sync({ force: false });
  } catch (error) {
      console.error("Unable to connect to the database:", error);
  }
};

syncModels();


//### Rotas ###
rotas.get("/", function (req, res) {
  res.send("Rota principal");
});

rotas.get("/Usuario/:nome/:cpf/:setor/:email/:senha", async function (req, res) {
  const { nome, email, senha } = req.params;
  try {
    const novoProf = await Usuario.create({ nome, email, senha });
    res.json({
      resposta: "Usuario criado com sucesso",
      professor: novoProf,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar Usuario", detalhe: error.message });
  }
});

rotas.get("/Tarefa/:nome/:desc/:data/:responsaveis/:setor", async function (req, res) {
  const { data, desc, finalidade } = req.params;
  try {
    const novoRelatorio = await Tarefa.create({ 
      descricao: desc, 
      tipo: finalidade, 
      data: new Date(data), // Converte a data para um objeto Date
    });
    res.json({
      resposta: "Relatório criado com sucesso",
      relatorio: novoRelatorio,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar relatório", detalhe: error.message });
  }
});

rotas.get("/evento/:nome/:data/:desc/:local/:horario", async function (req, res) {
  const { nome, data, desc, local, horario, } = req.params;
  try {
    const novoEvento = await Evento.create({ 
      nome, 
      data: new Date(data), // Converte a data para um objeto Date
      descricao: desc, 
      local,
      horario 
    });
    res.json({
      resposta: "Evento criado com sucesso",
      evento: novoEvento,
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar evento", detalhe: error.message });
  }
});

rotas.get("/mostrarEvent", async function (req, res) {
    const evento = await Tarefa.findAll(); // Busca todos os registros
    res.json(evento); // Retorna os registros em formato JSON
});

rotas.get("/mostrarProf", async function (req, res) {
    const professor = await Professor.findAll(); // Busca todos os registros
    res.json(professor); // Retorna os registros em formato JSON
});

rotas.get("/mostrarRela", async function (req, res) {
    const relatorio = await Relatorio.findAll(); // Busca todos os registros
    res.json(relatorio); // Retorna os registros em formato JSON
});

rotas.get("/deletarEvent/:id", async function (req, res) {
    const { id } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const deleted = await Evento.destroy({
      where: { id: idNumber },
    });
  
    if (deleted) {
      res.json({ mensagem: "Evento deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Evento não encontrado" });
    }
  });

  rotas.get("/deletarProf/:id", async function (req, res) {
    const { id } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const deleted = await Professor.destroy({
      where: { id: idNumber },
    });
  
    if (deleted) {
      res.json({ mensagem: "Professor deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Professor não encontrado" });
    }
  });

  rotas.get("/deletarRela/:id", async function (req, res) {
    const { id } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    const deleted = await Relatorio.destroy({
      where: { id: idNumber },
    });
  
    if (deleted) {
      res.json({ mensagem: "Relatorio deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Relatorio não encontrado" });
    }
  });

//### Servidor ###
rotas.listen(3031, function () {
  console.log("Server is running on port 3031");
});
