-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 30/11/2024 às 02:06
-- Versão do servidor: 10.4.28-MariaDB
-- Versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `tasks`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `tarefas`
--

CREATE TABLE `tarefas` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `data` date DEFAULT NULL,
  `responsaveis` varchar(255) DEFAULT NULL,
  `setor` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tarefas`
--

INSERT INTO `tarefas` (`id`, `nome`, `descricao`, `data`, `responsaveis`, `setor`, `createdAt`, `updatedAt`) VALUES
(1, 'Análise de Dados', 'Analisar os dados coletados do desempenho dos usuários.', '2024-11-01', 'Ana Souza, Maria Fernanda', 'TI', '2024-10-25 00:43:33', '2024-10-25 00:43:33'),
(2, 'Preparar Apresentação', 'Criar apresentação sobre os resultados da análise.', '2024-11-05', 'Pedro Almeida', 'Administração', '2024-10-25 00:43:33', '2024-10-25 00:43:33'),
(3, 'Revisão de Projetos', 'Revisar o andamento dos projetos em equipe.', '2024-11-10', 'Pedro Almeida, João Batista', 'Administração', '2024-10-25 00:43:33', '2024-10-25 00:43:33'),
(4, 'Preparar Relatório Financeiro', 'Preparar relatório financeiro dos projetos.', '2024-11-20', 'João Batista', 'Financeiro', '2024-10-25 00:43:33', '2024-10-25 00:43:33');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `tarefas`
--
ALTER TABLE `tarefas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `tarefas`
--
ALTER TABLE `tarefas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
