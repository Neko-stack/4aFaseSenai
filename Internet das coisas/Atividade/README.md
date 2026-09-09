# Brilho & Ordem — Gestão de Faxinas

Sistema simples para organizar agendamentos de faxinas residenciais e comerciais.

## Executar a interface

```bash
cd frontend
npm install
npm run dev
```

O banco PostgreSQL e os dados iniciais estão em `database/faxina_db.sql`. Os requisitos e os casos de teste estão em `DOCUMENTACAO.md`.

## Executar a API

1. Crie o banco executando `database/faxina_db.sql` no PostgreSQL.
2. Informe a senha do PostgreSQL no arquivo `backend/.env`.
3. Execute:

```bash
cd backend
npm install
npm start
```

A API usa a porta `3000`.
