const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const bcrypt = require("bcrypt");

// Configuração do Express e do Banco de Dados
const rotas = express();
rotas.use(cors());
rotas.use(express.json());  // Adiciona o middleware para parsear o corpo da requisição como JSON

const sequelize = new Sequelize("tasks", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Modelos
const Usuario = sequelize.define("Usuario", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING },
  cpf: { type: DataTypes.STRING, unique: true },
  setor: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true, validate: { isEmail: true } },
  senha: { type: DataTypes.STRING },
}, {
  hooks: {
    beforeCreate: async (usuario) => {
      try {
        if (usuario.senha) {
          usuario.senha = await bcrypt.hash(usuario.senha, 10);
        }
      } catch (error) {
        throw new Error('Erro ao criptografar a senha: ' + error.message);
      }
    },
  }
});

const Relatorio = sequelize.define("Relatorio", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  finalidade: { type: DataTypes.STRING },
  data: { type: DataTypes.DATE },
  descricao: { type: DataTypes.TEXT },
  componentes: { type: DataTypes.TEXT },
  tarefaId: {
    type: DataTypes.INTEGER,
    references: { model: 'Tarefas', key: 'id' },
    allowNull: true,
  },
});

const Tarefa = sequelize.define("Tarefa", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING },
  descricao: { type: DataTypes.TEXT },
  prazo: { type: DataTypes.DATE },
  responsaveis: { type: DataTypes.STRING },
  setor: { type: DataTypes.STRING },
});

// Relacionamentos
Tarefa.hasOne(Relatorio, { foreignKey: 'tarefaId' }); // Uma Tarefa tem um Relatório
Relatorio.belongsTo(Tarefa, { foreignKey: 'tarefaId' }); // Relatório pertence a uma Tarefa

// Sincronização do banco de dados
const syncModels = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });  // Define force: true se quiser recriar as tabelas
    console.log("Banco de dados conectado e sincronizado.");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
  }
};

syncModels();

// Rotas
rotas.get("/", (req, res) => {
  res.send("API Principal");
});

// Criar usuário
rotas.post("/usuario", async (req, res) => {
  const { nome, cpf, setor, email, senha } = req.body;
  try {
    if (!nome || !cpf || !setor || !email || !senha) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
    }
    const usuario = await Usuario.create({ nome, cpf, setor, email, senha });
    res.json({ mensagem: "Usuário criado com sucesso", usuario });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar usuário", detalhe: error.message });
  }
});

// Criar relatório
rotas.post("/relatorio", async (req, res) => {
  const { finalidade, data, descricao, componentes, tarefaId } = req.body;
  try {
    if (!finalidade || !data || !descricao || !componentes) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
    }
    const relatorio = await Relatorio.create({ finalidade, data, descricao, componentes, tarefaId });
    res.json({ mensagem: "Relatório criado com sucesso", relatorio });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar relatório", detalhe: error.message });
  }
});

// Criar tarefa
rotas.post("/tarefa", async (req, res) => {
  const { nome, descricao, data, responsaveis, setor } = req.body;
  
  if (!nome || !descricao || !data || !responsaveis || !setor) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
  }

  try {
    const tarefa = await Tarefa.create({
      nome,
      descricao,
      data: new Date(data),  // Certifique-se que a data esteja no formato correto
      responsaveis,
      setor,
    });
    res.json({ mensagem: "Tarefa criada com sucesso", tarefa });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar tarefa", detalhe: error.message });
  }
});

// Mostrar todos os usuários
rotas.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar usuários", detalhe: error.message });
  }
});

// Mostrar todos os relatórios
rotas.get("/relatorios", async (req, res) => {
  try {
    const relatorios = await Relatorio.findAll();
    res.json(relatorios);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar relatórios", detalhe: error.message });
  }
});

// Mostrar todas as tarefas
rotas.get("/tarefas", async (req, res) => {
  try {
    const tarefas = await Tarefa.findAll();
    res.json(tarefas);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar tarefas", detalhe: error.message });
  }
});

// Deletar relatório
rotas.delete("/relatorio/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Relatorio.destroy({ where: { id } });
    if (deleted) {
      res.json({ mensagem: "Relatório deletado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Relatório não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar relatório", detalhe: error.message });
  }
});

// Deletar tarefa
rotas.delete("/tarefa/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Tarefa.destroy({ where: { id } });
    if (deleted) {
      res.json({ mensagem: "Tarefa deletada com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Tarefa não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar tarefa", detalhe: error.message });
  }
});

// Atualizar relatório
rotas.put("/relatorio/:id", async (req, res) => {
  const { id } = req.params;
  const { finalidade, data, descricao, componentes, tarefaId } = req.body;
  try {
    const [updated] = await Relatorio.update(
      { finalidade, data, descricao, componentes, tarefaId },
      { where: { id } }
    );
    if (updated) {
      res.json({ mensagem: "Relatório atualizado com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Relatório não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar relatório", detalhe: error.message });
  }
});

// Atualizar tarefa
rotas.put("/tarefa/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, data, responsaveis, setor } = req.body;
  try {
    const [updated] = await Tarefa.update(
      { nome, descricao, data, responsaveis, setor },
      { where: { id } }
    );
    if (updated) {
      res.json({ mensagem: "Tarefa atualizada com sucesso" });
    } else {
      res.status(404).json({ mensagem: "Tarefa não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar tarefa", detalhe: error.message });
  }
});

// Iniciar servidor
rotas.listen(3031, () => {
  console.log("servidor localhost:3031 iniciado com sucesso");
});
