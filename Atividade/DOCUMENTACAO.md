# Documentação do projeto

## Objetivo

O Brilho & Ordem foi feito para ajudar no controle de faxinas residenciais e comerciais. Com ele é possível organizar os agendamentos, verificar a agenda dos profissionais e evitar horários duplicados.

## Requisitos funcionais

| Código | Descrição |
|---|---|
| RF01 | O sistema deve permitir login e informar quando os dados estão incorretos. |
| RF02 | Depois do login, deve mostrar o nome do usuário e permitir sair da conta. |
| RF03 | Deve ter acesso ao painel principal, ao cadastro e à gestão de agendamentos. |
| RF04 | Deve permitir listar, pesquisar, cadastrar, editar e cancelar agendamentos. |
| RF05 | Cada agendamento deve guardar cliente, profissional, tipo de serviço, data, horário, duração, endereço e observações. |
| RF06 | A agenda deve ficar em ordem de data e horário. |
| RF07 | O sistema deve avisar quando faltar um campo, quando o profissional estiver fora do horário ou quando houver conflito na agenda. |
| RF08 | O painel deve avisar quando existir serviço marcado para as próximas 24 horas. |
| RF09 | As ações de criar, editar e cancelar devem ficar registradas no histórico. |



## Telas do sistema

Login e cadastro: a tela inicial possui as opções Entrar e Cadastrar. O cadastro pede nome, e-mail, senha e confirmação de senha. Caso o login falhe, a mensagem aparece na própria tela.

Painel principal: mostra a quantidade de agendamentos, clientes e profissionais cadastrados. Também apresenta um aviso quando há serviço nas próximas 24 horas.

Cadastro de agendamento: o usuário informa cliente, profissional, tipo de serviço, data, horário, duração, endereço, necessidades e status.

Gestão de agendamentos: exibe a lista de serviços, permite buscar por cliente, profissional ou tipo de serviço, editar os dados e cancelar um agendamento. A agenda cronológica aparece na mesma tela.

## Validações

Antes de salvar um agendamento, o sistema verifica se os campos obrigatórios foram preenchidos. Também confere se o profissional trabalha naquele horário e se já existe outro serviço que ocupa o mesmo período. Se houver problema, o agendamento não é salvo e uma mensagem é exibida.



## Testes realizados

| Teste | Resultado esperado |
|---|---|
| Login com dados inválidos | Mostrar mensagem de erro e continuar na tela de login. |
| Cadastro de usuário | Criar a conta quando os dados forem válidos. |
| Novo agendamento | Salvar e mostrar o registro na lista. |
| Busca, edição e cancelamento | Atualizar a lista conforme a ação realizada. |
| Conflito de horário | Impedir o salvamento e informar o motivo. |
| Alerta de proximidade | Mostrar aviso para serviços nas próximas 24 horas. |
| Histórico | Registrar criação, alteração e cancelamento no banco. |



## Tecnologias usadas

- Windows 11;
- Node.js 22;
- React 19 e Vite 8 no frontend;
- TypeScript, Express e Prisma 7 no backend;
- PostgreSQL 16 ou superior no banco de dados.




