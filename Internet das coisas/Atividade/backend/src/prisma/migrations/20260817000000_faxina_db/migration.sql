-- Migração inicial do domínio Brilho & Ordem (PostgreSQL)
CREATE TABLE "usuario" (
  "id" SERIAL NOT NULL,
  "nome" VARCHAR(120) NOT NULL,
  "email" VARCHAR(160) NOT NULL,
  "senha_hash" VARCHAR(255) NOT NULL,
  "perfil" VARCHAR(20) NOT NULL DEFAULT 'OPERADOR',
  CONSTRAINT "usuario_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "usuario_email_key" UNIQUE ("email")
);
CREATE TABLE "cliente" (
  "id" SERIAL NOT NULL,
  "nome" VARCHAR(150) NOT NULL,
  "telefone" VARCHAR(20) NOT NULL,
  "email" VARCHAR(160),
  "endereco" VARCHAR(255) NOT NULL,
  CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "profissional" (
  "id" SERIAL NOT NULL,
  "nome" VARCHAR(150) NOT NULL,
  "telefone" VARCHAR(20) NOT NULL,
  "email" VARCHAR(160),
  "ativo" BOOLEAN NOT NULL DEFAULT true,
  "hora_inicio" TIME NOT NULL DEFAULT '08:00',
  "hora_fim" TIME NOT NULL DEFAULT '18:00',
  CONSTRAINT "profissional_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "agendamento" (
  "id" SERIAL NOT NULL,
  "cliente_id" INTEGER NOT NULL,
  "profissional_id" INTEGER NOT NULL,
  "tipo_servico" VARCHAR(20) NOT NULL,
  "data_hora" TIMESTAMP NOT NULL,
  "duracao_minutos" INTEGER NOT NULL DEFAULT 120,
  "endereco" VARCHAR(255) NOT NULL,
  "necessidades" TEXT,
  "status" VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
  "criado_em" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "agendamento_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "agendamento_profissional_id_data_hora_key" UNIQUE ("profissional_id", "data_hora"),
  CONSTRAINT "agendamento_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id"),
  CONSTRAINT "agendamento_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissional"("id")
);
CREATE TABLE "historico_agendamento" (
  "id" SERIAL NOT NULL,
  "agendamento_id" INTEGER NOT NULL,
  "usuario_id" INTEGER,
  "acao" VARCHAR(30) NOT NULL,
  "descricao" TEXT NOT NULL,
  "data_operacao" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "historico_agendamento_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "historico_agendamento_agendamento_id_fkey" FOREIGN KEY ("agendamento_id") REFERENCES "agendamento"("id") ON DELETE CASCADE,
  CONSTRAINT "historico_agendamento_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id")
);
