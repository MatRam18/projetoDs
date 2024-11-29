const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");


// Configuração do Express e do Banco de Dados
const rotas = express();
rotas.use(cors());
rotas.use(express.json());  // Adiciona o middleware para parsear o corpo da requisição como JSON
rotas.use(bodyParser.json());

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
  data: { type: DataTypes.DATE },
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
rotas.get('/tarefa/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const tarefa = await Tarefa.findByPk(id);
      res.json(tarefa);
  } catch (err) {
      res.status(500).send('Erro ao buscar tarefa');
  }
});

// Atualizar relatório
rotas.get('/relatorio/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const relatorio = await Relatorio.findByPk(id, {
          include: [{ model: Tarefa, as: 'tarefa' }]  // Incluindo a tarefa relacionada
      });
      if (relatorio) {
          res.json(relatorio);
      } else {
          res.status(404).json({ error: 'Relatório não encontrado' });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Rota para atualizar um relatório
rotas.put('/relatorio/:id', async (req, res) => {
  const { id } = req.params;
  const { finalidade, data, descricao, componente, tarefaId } = req.body;

  try {
      const relatorio = await Relatorio.findByPk(id);
      if (!relatorio) {
          return res.status(404).json({ error: 'Relatório não encontrado' });
      }

      // Atualizando os dados do relatório
      await relatorio.update({
          finalidade,
          data,
          descricao,
          componente,
          tarefaId
      });

      res.json(relatorio);  // Retorna o relatório atualizado
  } catch (error) {
      res.status(500).json({ error: error.message });
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

rotas.get("/rela/:finalidade", async (req, res) => {
  try {
    const finalidade = req.params.finalidade;  // Obter o parâmetro diretamente da URL
    const relatorio = await Relatorio.findOne({ where: { finalidade } });  // Buscando no banco pelo campo "finalidade"

    if (!relatorio) {
      return res.status(404).json({ erro: "Relatório não encontrado" });  // Caso o relatório não exista
    }

    return res.json(relatorio);  // Retorna o relatório se encontrado
  } catch (error) {
    console.error(error);  // Exibe o erro no console para depuração
    return res.status(500).json({ erro: "Erro ao buscar relatório", detalhe: error.message });
  }
});


// Rota para buscar um relatório específico pelo nome (finalidade)
rotas.get('/relatorio/nome/:finalidade', async (req, res) => {
  const { finalidade } = req.params;
  
  try {
      const relatorio = await Relatorio.findOne({
          where: {
              finalidade: finalidade
          }
      });

      if (!relatorio) {
          return res.status(404).json({ message: 'Relatório não encontrado' });
      }

      res.json(relatorio);
  } catch (error) {
      console.error('Erro ao buscar relatório:', error);
      res.status(500).json({ error: 'Erro ao buscar relatório' });
  }
});


// Rota para associar uma tarefa a um relatório
rotas.post('/relatorio/:relatorioId/associar-tarefa', async (req, res) => {
  const { relatorioId } = req.params;
  const { tarefaId } = req.body;

  try {
      const relatorio = await Relatorio.findByPk(relatorioId);
      if (!relatorio) {
          return res.status(404).json({ message: 'Relatório não encontrado' });
      }

      const tarefa = await Tarefa.findByPk(tarefaId);
      if (!tarefa) {
          return res.status(404).json({ message: 'Tarefa não encontrada' });
      }

      // Atualiza a relação entre o relatório e a tarefa
      relatorio.tarefaId = tarefaId;
      await relatorio.save();

      res.json({ message: 'Tarefa associada com sucesso!' });
  } catch (error) {
      console.error('Erro ao associar tarefa ao relatório:', error);
      res.status(500).json({ error: 'Erro ao associar tarefa' });
  }
});
rotas.post('/relatorio/atualizar/:nome', async (req, res) => {
  const nomeRelatorio = req.params.nome;
  const { finalidade, data, descricao, componentes, tarefaId } = req.body;

  // Aqui você deve realizar a lógica de atualização no banco de dados
  // Exemplo com um banco de dados MongoDB:
  const resultado = await Relatorio.updateOne(
      { nome: nomeRelatorio }, // filtro para encontrar o relatório
      { $set: { finalidade, data, descricao, componentes, tarefaId } } // dados a atualizar
  );

  if (resultado.modifiedCount > 0) {
      res.status(200).send("Relatório atualizado com sucesso!");
  } else {
      res.status(400).send("Erro ao atualizar o relatório.");
  }
});

rotas.put('/relatorio/atualizar/:finalidade', (req, res) => {
  const finalidade = req.params.finalidade;  // Pega a finalidade do relatório
  const { data, descricao, componentes, tarefaId } = req.body;  // Dados a serem atualizados

  // Encontrar o relatório com a finalidade especificada
  const relatorio = relatorios.find(r => r.finalidade === finalidade);

  if (!relatorio) {
      return res.status(404).json({ message: "Relatório não encontrado com a finalidade fornecida." });
  }

  // Atualizar o relatório
  relatorio.data = data || relatorio.data;
  relatorio.descricao = descricao || relatorio.descricao;
  relatorio.componentes = componentes || relatorio.componentes;
  relatorio.tarefaId = tarefaId || relatorio.tarefaId;

  // Responder com sucesso
  res.status(200).json({ message: "Relatório atualizado com sucesso!", relatorio });
});



// Atualizar relatório (modificado para usar Sequelize)

rotas.put('/relatorio/atualizar/:finalidade', async (req, res) => {
  const { finalidade, descricao, data, componentes, tarefaId } = req.body;

  try {
      if (!finalidade || !descricao || !data || !componentes) {
          return res.status(400).json({ error: "Todos os campos são obrigatórios." });
      }

      // Tente capturar possíveis erros
      const [updated] = await Relatorio.update(
          {
              descricao, 
              data, 
              componentes, 
              tarefaId: tarefaId || null
          },
          {
              where: { finalidade: req.params.finalidade }
          }
      );

      if (updated === 0) {
          return res.status(404).json({ error: "Relatório não encontrado." });
      }

      const updatedRelatorio = await Relatorio.findOne({
          where: { finalidade: req.params.finalidade }
      });

      res.json(updatedRelatorio);
  } catch (err) {
      console.error('Erro ao atualizar o relatório:', err); // Aqui você pode ver o erro no console
      res.status(500).json({ error: "Erro interno do servidor: " + err.message });
  }
});


// Rota para pegar os detalhes do relatório
rotas.get('/api/relatorios/:id', (req, res) => {
  const relatorio = relatorios.find(r => r.id == req.params.id);
  if (relatorio) {
      res.json(relatorio);
  } else {
      res.status(404).json({ error: 'Relatório não encontrado' });
  }
});

// Rota para atualizar o relatório
rotas.put('/api/relatorios/upd/:id', (req, res) => {
  const relatorioIndex = relatorios.findIndex(r => r.id == req.params.id);
  if (relatorioIndex !== -1) {
      // Atualiza os dados
      relatorios[relatorioIndex] = { id: req.params.id, ...req.body };
      res.json(relatorios[relatorioIndex]);
  } else {
      res.status(404).json({ error: 'Relatório não encontrado' });
  }
});
// Iniciar servidor
rotas.listen(3031, () => {
  console.log("Servidor rodando na porta 3031");
});
