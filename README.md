<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

API em [NestJS](https://github.com/nestjs/nest) com TypeORM e MySQL. Use o arquivo `.env` na raiz (não versionado; veja modelo abaixo) para alinhar variáveis com o Docker Compose.

## Variáveis de ambiente (`.env`)

Crie um arquivo `.env` na raiz do repositório. O Docker Compose lê esse arquivo para substituir `${...}` nos YAMLs e para repassar credenciais aos serviços.

| Variável | Descrição |
|----------|-----------|
| `APP_PORT` | Porta no host exposta para a API (padrão `3000`). |
| `DATABASE_HOST` | Host do MySQL. **Dentro do Compose**, use `db` (nome do serviço). **Fora do Docker**, use `127.0.0.1` e a porta em `MYSQL_PUBLISH_PORT`. |
| `DATABASE_PORT` | Porta MySQL **dentro** da rede Docker (`3306`). |
| `DATABASE_USER` | Usuário da aplicação (deve coincidir com `MYSQL_USER` no compose). |
| `DATABASE_PASSWORD` | Senha da aplicação (deve coincidir com `MYSQL_PASSWORD`). |
| `DATABASE_NAME` | Nome do banco (deve coincidir com `MYSQL_DATABASE`). |
| `MYSQL_ROOT_PASSWORD` | Senha do usuário `root` do MySQL (usada no healthcheck em produção). |
| `MYSQL_PUBLISH_PORT` | Porta no **host** mapeada para o MySQL (dev: `3307`; prod costuma ser `3306`). |
| `MYSQL_CONTAINER_NAME` | Nome do container do MySQL (principalmente `docker-compose.prod.yml`). |

Exemplo para desenvolvimento com Docker (mesmos valores sugeridos no repositório):

```env
APP_PORT=3000
DATABASE_HOST=db
DATABASE_PORT=3306
DATABASE_USER=app
DATABASE_PASSWORD=app
DATABASE_NAME=nest
MYSQL_ROOT_PASSWORD=root
MYSQL_PUBLISH_PORT=3307
MYSQL_CONTAINER_NAME=mysql-db
```

Em **produção**, altere todas as senhas e nomes fracos; o `docker-compose.prod.yml` exige `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` e `MYSQL_ROOT_PASSWORD` definidos (sem fallback).

## Rodar com Docker (recomendado)

Pré-requisitos: [Docker](https://docs.docker.com/get-docker/) e plugin Compose (`docker compose`) ou `docker-compose` legado.

### Desenvolvimento (hot reload + MySQL)

Na raiz do projeto, com `.env` configurado:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Se o seu ambiente só tiver `docker-compose` (v1):

```bash
docker-compose -f docker-compose.dev.yml up --build
```

- API: `http://localhost:${APP_PORT:-3000}` (por padrão `http://localhost:3000`).
- MySQL no host (DBeaver, CLI, etc.): `127.0.0.1` e porta `${MYSQL_PUBLISH_PORT}` (padrão dev `3307`), usuário/senha conforme `.env`.

Encerrar e remover contêineres da stack de dev:

```bash
docker compose -f docker-compose.dev.yml down
```

### Produção

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

Parar:

```bash
docker compose -f docker-compose.prod.yml down
```

Após configurar o TypeORM com migrações, execute os comandos de migração dentro do contêiner da API, por exemplo:

```bash
docker compose -f docker-compose.prod.yml exec nest-app npm run <script-de-migracao>
```

(substitua pelo script que você definir no `package.json`).

## Project setup (local, sem Docker)

```bash
$ npm install
```

Garanta um MySQL acessível e variáveis coerentes (por exemplo `DATABASE_HOST=127.0.0.1`, `DATABASE_PORT` igual à porta do seu MySQL). O Nest não carrega `.env` automaticamente a menos que você use algo como `@nestjs/config`.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
