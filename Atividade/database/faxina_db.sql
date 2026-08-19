-- Banco de dados: faxina_db (PostgreSQL 16+)
CREATE DATABASE faxina_db;
\c faxina_db;

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  perfil VARCHAR(20) NOT NULL DEFAULT 'OPERADOR'
);

CREATE TABLE cliente (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(160),
  endereco VARCHAR(255) NOT NULL
);

CREATE TABLE profissional (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(160),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  hora_inicio TIME NOT NULL DEFAULT '08:00',
  hora_fim TIME NOT NULL DEFAULT '18:00',
  CHECK (hora_fim > hora_inicio)
);

CREATE TABLE agendamento (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES cliente(id),
  profissional_id INTEGER NOT NULL REFERENCES profissional(id),
  tipo_servico VARCHAR(20) NOT NULL CHECK (tipo_servico IN ('RESIDENCIAL', 'COMERCIAL')),
  data_hora TIMESTAMP NOT NULL,
  duracao_minutos INTEGER NOT NULL DEFAULT 120 CHECK (duracao_minutos BETWEEN 30 AND 720),
  endereco VARCHAR(255) NOT NULL,
  necessidades TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO')),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (profissional_id, data_hora)
);

CREATE TABLE historico_agendamento (
  id SERIAL PRIMARY KEY,
  agendamento_id INTEGER NOT NULL REFERENCES agendamento(id) ON DELETE CASCADE,
  usuario_id INTEGER REFERENCES usuario(id),
  acao VARCHAR(30) NOT NULL,
  descricao TEXT NOT NULL,
  data_operacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuario (nome, email, senha_hash, perfil) VALUES
('Administrador', 'admin@brilhoordem.com', '$2b$10$aJ86p7EDR19FjXn23Fj0euz/nMj11Ic2zk72pEwZbjfOKvbzrpj0m', 'ADMIN'),
('Lia Operadora', 'lia@brilhoordem.com', '$2b$10$aJ86p7EDR19FjXn23Fj0euz/nMj11Ic2zk72pEwZbjfOKvbzrpj0m', 'OPERADOR'),
('Rui Gestor', 'rui@brilhoordem.com', '$2b$10$aJ86p7EDR19FjXn23Fj0euz/nMj11Ic2zk72pEwZbjfOKvbzrpj0m', 'OPERADOR');
INSERT INTO cliente (nome, telefone, email, endereco) VALUES
('Ana Souza', '(11) 99999-1111', 'ana@email.com', 'Rua das Flores, 120'),
('Empresa Horizonte', '(11) 98888-2222', 'contato@horizonte.com', 'Av. Central, 450'),
('Beatriz Alves', '(11) 97777-3333', 'bia@email.com', 'Rua do Sol, 75');
INSERT INTO profissional (nome, telefone, email, hora_inicio, hora_fim) VALUES
('Mariana Lima', '(11) 96666-1111', 'mariana@brilhoordem.com', '08:00', '17:00'),
('Carlos Mendes', '(11) 95555-2222', 'carlos@brilhoordem.com', '09:00', '18:00'),
('Joana Santos', '(11) 94444-3333', 'joana@brilhoordem.com', '08:00', '16:00');
INSERT INTO agendamento (cliente_id, profissional_id, tipo_servico, data_hora, duracao_minutos, endereco, necessidades, status) VALUES
(1, 1, 'RESIDENCIAL', '2026-08-20 08:00:00', 120, 'Rua das Flores, 120', 'Apartamento com 2 quartos', 'CONFIRMADO'),
(2, 2, 'COMERCIAL', '2026-08-20 13:30:00', 180, 'Av. Central, 450', 'Limpeza de escritório', 'CONFIRMADO'),
(3, 1, 'RESIDENCIAL', '2026-08-21 09:00:00', 90, 'Rua do Sol, 75', 'Produtos antialérgicos', 'PENDENTE');
INSERT INTO historico_agendamento (agendamento_id, usuario_id, acao, descricao) VALUES
(1, 1, 'CRIACAO', 'Agendamento residencial criado.'),
(2, 2, 'CRIACAO', 'Agendamento comercial criado.'),
(3, 3, 'CRIACAO', 'Agendamento residencial criado.');
