# Features aplicadas no projeto

Este arquivo resume as features que foram ajustadas e integradas entre frontend, backend e banco de dados.

## 1. Busca avancada de pacientes

Foi aplicada uma busca mais completa na listagem de pacientes.

Agora o frontend permite filtrar pacientes por:

- Nome
- Email
- Telefone
- Sexo
- Convenio
- Alergias
- Anotacoes rapidas

No backend, o model `Paciente` foi alinhado para armazenar os campos usados pela busca:

- `telefone`
- `convenio`
- `alergias`
- `observacoes`


Arquivos principais relacionados:

- `frontend/src/components/PatientsList/index.jsx`
- `frontend/src/components/RegisterFormPatient/index.jsx`
- `frontend/src/components/PatientDetails/index.jsx`
- `backend/src/repositories/PacienteRepository.ts`

## 2. Ordenacao de consultas e exames por data

Foi aplicada ordenacao de consultas e exames por data.

O frontend permite alternar a exibicao entre:

- Mais recentes primeiro
- Mais antigos primeiro

A ordenacao de consultas usa o campo `data_consulta`, que vem do backend no model `Consulta`.

A ordenacao de exames usa o campo `data_exame`, que vem do backend no model `Exame`.

Arquivos principais relacionados:

- `frontend/src/components/PatientDetails/index.jsx`
- `frontend/src/components/ExamsList/index.jsx`
- `backend/src/prisma/schema.prisma`

## 3. Dark Mode

Foi criado um sistema de tema claro/escuro no frontend.

O frontend agora possui:

- `ThemeContext` para controlar o tema atual
- `ThemeProvider` aplicado na aplicacao
- Botao no menu lateral para alternar entre modo claro e modo escuro
- Classes visuais `dark:` em componentes principais

Arquivos principais relacionados:

- `frontend/src/contexts/ThemeContext.jsx`
- `frontend/src/main.jsx`
- `frontend/src/components/SideMenu/index.jsx`

## 4. Campo de anotacoes rapidas do paciente

Foi adicionada a feature de anotacoes rapidas do paciente.

Esse campo serve para registrar observacoes simples e praticas sobre o paciente, como preferencia de contato, lembretes de retorno ou informacoes importantes para atendimento.

No frontend, o campo aparece como:

- `Anotacoes rapidas`

No backend e no banco, o campo tecnico usado e:

- `observacoes`

Esse nome tecnico foi mantido para seguir o padrao do model e facilitar a integracao com Prisma e API.

Fluxo da feature:

1. O usuario preenche as anotacoes rapidas no cadastro ou edicao do paciente.
2. O frontend envia o valor no campo `observacoes`.
3. O backend recebe esse campo no cadastro do paciente.
4. O Prisma salva o valor na coluna `observacoes` da tabela `Paciente`.
5. A listagem e os detalhes do paciente exibem as anotacoes.

Arquivos principais relacionados:

- `frontend/src/components/RegisterFormPatient/index.jsx`
- `frontend/src/components/PatientsList/index.jsx`
- `frontend/src/components/PatientDetails/index.jsx`
- `backend/src/prisma/schema.prisma`
- `backend/src/repositories/PacienteRepository.ts`

## 5. Alinhamento entre frontend, backend e banco

Tambem foram feitos ajustes para que os nomes dos campos e endpoints fiquem coerentes entre as camadas do projeto.

Endpoints principais usados pelo frontend:

- `/cadastro`
- `/login`
- `/pacientes`
- `/consultas`
- `/exames`
- `/prontuarios`

Campos principais do paciente alinhados:

- `nome`
- `cpf`
- `telefone`
- `email`
- `data_nascimento`
- `sexo`
- `convenio`
- `alergias`
- `observacoes`
- `responsavel`

Com isso, o frontend envia dados com os mesmos nomes esperados pelo backend, e o backend salva os campos existentes no schema do Prisma.

## 6. Validacoes feitas

Foram feitas validacoes tecnicas para confirmar que o projeto continua compilando e que o schema do banco esta valido.

Validacoes realizadas:

- Build do frontend com `npm run build`
- Typecheck do backend com `npx tsc --noEmit`
- Validacao do Prisma com `npx prisma validate`
- Geracao do Prisma Client com `npx prisma generate`
- Atualizacao do banco com `npx prisma db push`

Resultado: as validacoes passaram apos os ajustes aplicados.
