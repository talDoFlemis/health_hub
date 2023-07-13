# Health Hub

O Health Hub é um repositório de código fonte que foi desenvolvido como parte de um trabalho para a disciplina de Técnicas de Programação na faculdade.
Este projeto tem como objetivo criar uma aplicação web voltada para o setor de saúde, utilizando tecnologias como Spring e Next.js.

## Testando a aplicação

Exploraremos a maneira de testar a aplicação Health Hub usando `Docker` para o build e um script de seed para gerar dados de teste.
Essas abordagens permitem criar um ambiente isolado e replicável para avaliar o funcionamento correto da aplicação, garantindo sua qualidade e validando suas funcionalidades no contexto do setor de saúde.

### Usuário padrões do seed

Esses são os usuários padrões que são produzidos no seed do banco de dados

- `gepeto`: administrador do sistema, possui todas as permissões do site

  - login: gepeto@healthhub.com
  - senha: 1234

- `gabrigas`: atendente do sistema, possui permissão de criar paciente, consultas e visualização de médicos

  - login: gabrigas@healthhub.com
  - senha: 1234

- `tubias`: paciente do sistema, possui somente a permissão de ver as próprias consultas
  - login: tubias@healthhub.com
  - senha: 1234

### Usando Docker

Para utilizar o `Health Hub` com docker basta executar os seguintes comandos na pasta raiz

Utilizamos esse comando para fazer o build do Spring e NextJS

```bash
docker compose build
```

E rodamos a aplicação já configurada com `Nginx`, `Postgres`, etc

```bash
docker compose up -d
```

Acesse no seu navegador na [página inicial](http://localhost) e teste com os usuários padrões
