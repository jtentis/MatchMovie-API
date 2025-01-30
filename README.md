<div class="corpo" align="center"> 

<img src="./markdown/logo_md.png" width="450px" height="200px">

![GitHub language count](https://img.shields.io/github/languages/count/jtentis/MatchMovie-API?color=D46162)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/y/jtentis/MatchMovie-API?color=D46162)

</div>

## 📌 Visão Geral
O backend do **Match Movie** é responsável por gerenciar os dados dos usuários, filmes, APIs externas e interações dentro do aplicativo. Ele expõe uma API RESTful que permite que o aplicativo mobile consuma os dados de forma eficiente.

O backend foi desenvolvido em **Node.js** com o framework **Nest.js**, utilizando **PostgreSQL** com **PrismaORM** e integração com APIs externas para obter informações atualizadas sobre filmes.

---

## 🏗️ Arquitetura
- **Linguagem**: TypeScript
- **Framework**: Node.js/Nest.js
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma
- **Autenticação**: JWT (JSON Web Token)
- **Documentação**: Swagger
- **Hospedagem**: Heroku (em breve)
- **APIs Externas**: TMDb (The Movie Database) para informações sobre filmes e séries, Ingresso.com para redirecionamento de usuários para salas de cinema e OpenCage API para cálculo de localização.

```
src/
┣ auth/
┃ ┣ dto/
┃ ┃ ┗ login.dto.ts
┃ ┣ entity/
┃ ┃ ┗ auth.entity.ts
┃ ┣ auth.controller.spec.ts
┃ ┣ auth.controller.ts
┃ ┣ auth.module.ts
┃ ┣ auth.service.spec.ts
┃ ┣ auth.service.ts
┃ ┣ jwt-auth.guard.ts
┃ ┗ jwt.strategy.ts
┣ favorites/
┃ ┣ dto/
┃ ┃ ┗ favorite-movie.dto.ts
┃ ┣ favorites.controller.spec.ts
┃ ┣ favorites.controller.ts
┃ ┣ favorites.module.ts
┃ ┣ favorites.service.spec.ts
┃ ┗ favorites.service.ts
┣ geolocation/
┃ ┣ geolocation.controller.spec.ts
┃ ┣ geolocation.controller.ts
┃ ┣ geolocation.module.ts
┃ ┣ geolocation.service.spec.ts
┃ ┗ geolocation.service.ts
┣ groups/
┃ ┣ dto/
┃ ┃ ┣ create-group.dto.ts
┃ ┃ ┗ update-group.dto.ts
┃ ┣ entities/
┃ ┃ ┗ group.entity.ts
┃ ┣ groups.controller.spec.ts
┃ ┣ groups.controller.ts
┃ ┣ groups.gateway.ts
┃ ┣ groups.module.ts
┃ ┣ groups.service.spec.ts
┃ ┗ groups.service.ts
┣ ingresso/
┃ ┣ ingresso.controller.spec.ts
┃ ┣ ingresso.controller.ts
┃ ┣ ingresso.module.ts
┃ ┣ ingresso.service.spec.ts
┃ ┗ ingresso.service.ts
┣ match/
┃ ┣ match.controller.spec.ts
┃ ┣ match.controller.ts
┃ ┣ match.module.ts
┃ ┣ match.service.spec.ts
┃ ┗ match.service.ts
┣ movies/
┃ ┣ movies.controller.spec.ts
┃ ┣ movies.controller.ts
┃ ┣ movies.module.ts
┃ ┣ movies.service.spec.ts
┃ ┗ movies.service.ts
┣ prisma/
┃ ┣ prisma.module.ts
┃ ┣ prisma.service.spec.ts
┃ ┗ prisma.service.ts
┣ users/
┃ ┣ dto/
┃ ┃ ┣ create-user.dto.ts
┃ ┃ ┗ update-user.dto.ts
┃ ┣ entities/
┃ ┃ ┗ user.entity.ts
┃ ┣ users.controller.spec.ts
┃ ┣ users.controller.ts
┃ ┣ users.module.ts
┃ ┣ users.service.spec.ts
┃ ┗ users.service.ts
┣ watched/
┃ ┣ dto/
┃ ┃ ┗ watched-movie-dto.ts
┃ ┣ watched.controller.spec.ts
┃ ┣ watched.controller.ts
┃ ┣ watched.module.ts
┃ ┣ watched.service.spec.ts
┃ ┗ watched.service.ts
┣ app.controller.spec.ts
┣ app.controller.ts
┣ app.module.ts
┣ app.service.ts
┗ main.ts
```
---

## 🌍 API REST
A API do **Match Movie** segue padrões REST e expõe endpoints para diversas funcionalidades:

### Autenticação
- `POST /auth/login` - Login e geração de token JWT

### Filmes e Séries
- `GET /movies/popular` - Lista de filmes populares
- `GET /movies/top_rated` - Lista de filmes melhor avaliados
- `GET /movies/now_playing` - Lista de filmes em cartaz
- `GET /movies/upcoming` - Lista de filmes em breve
- `GET /movies/search` - Lista de filmes por query
- `GET /movies/{movieId}/details` - Listar detalhes de filme
- `GET /movies/{movieId}/watch_providers` - Listar serviços de streaming do filme
- `GET /movies/{moviePoster}/poster` - Listar posters do filme

### Usuários
- `POST /users` - Registrar usuário
- `GET /users` - Listar usuários
- `GET /users/{id}` - Listar usuário especifico
- `PATCH /users/{id}` - Editar usuário especifico
- `DELETE /users/{id}` - Deletar usuário especifico
- `GET /users/username/{username}` - Procurar usuário pelo username
- `GET /users/{id}/upload-profile-picture` - Atualizar foto de perfil usuário
- `GET /users/{id}/groups` - Listar grupos que o usuário está

### Grupos
- `POST /groups` - Registrar grupo
- `GET /groups` - Listar grupos
- `GET /groups/{id}` - Listar grupo especifico
- `PATCH /groups/{id}` - Editar grupo especifico
- `DELETE /groups/{id}` - Deletar grupo especifico
- `POST /groups/{groupId}/users/{userId}` - Adicionar usuário no grupo
- `DELETE /groups/{groupId}/users/{userId}` - Remover usuário no grupo
- `GET /groups/{groupId}/users` - Listar usuários do grupo

### Favoritos do usuário
- `GET /favorites/isFavorite/{userId}/{movieId}` - Listar filmes favoritos do usuário
- `POST /favorites` - Marcar filme como favorito
- `GET /favorites/count/{userId}` - Contar quantidade de favoritos do usuário

### Assistidos do usuário
- `GET /watched/isWatched/{userId}/{movieId}` - Listar filmes assistidos do usuário
- `POST /watched` - Marcar filme como assistido
- `GET /watched/count/{userId}` - Contar quantidade de assistidos do usuário

### Geolocalização
- `GET /geolocation/{groupId}/midpoint` - Calcular ponto médio em latitude e longitude de usuários

### Ingresso
- `GET /ingresso/lat/{lat}/lng/{lng}` - Listar cinemas mais proximos baseado na localização média dos integrantes do grupo
- `GET /ingresso/city/{cityId}` - Pegar URL do cinema mais proximo para redirecionamento

### Match
- `POST /match/{groupId}/start/{movieId}` - Iniciar match (votação de filmes) para o grupo baseado no filme selecionado
- `POST /match/{groupId}/vote` - Registrar votos dos usuários
- `GET /match/{groupId}/recommendations` - Listar recomendações de filmes baseado no filme escolhido
- `POST /match/{groupId}/check` - Verificar estado de match
- `GET /match/{groupId}/history` - Listar historico de match
- `DELETE /match/{id}` - Deleter match do historico


## 🗄️ Banco de Dados
O banco de dados utilizado é **PostgreSQL**, estruturado com as seguintes tabelas principais:

![](./markdown/diagrama.png)


## 📜 Documentação com Swagger
A API está documentada com Swagger e pode ser acessada pelo seguinte endpoint:

![](./markdown/swagger.png)

## 🛠️ Como Rodar Localmente

1. **Clone o repositório**:
  ```bash
  git clone https://github.com/seu-repositorio/MatchMovie-API.git
  cd MatchMovie-API
  ```

2. **Configure as variáveis de ambiente**:

```env
DB_USER = ''
DB_PASSWORD = ''
DB_NAME=''

DATABASE_URL = 'postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}'

TMDB_API_KEY=''

OPENCAGE_API_KEY=''

JWT_SECRET = ''
```

3. **Suba os containers do Docker**
```bash
docker-compose up -d
```

4. **Acesse o container do backend e execute as migrações do banco de dados**
```bash
docker exec -it match-movie-backend npx prisma migrate dev
```

4. **A API estará disponivel em:**
```bash
http://localhost:3000
```

## 🚀 Conclusão
O backend do Match Movie foi desenvolvido utilizando Nest.js e PostgreSQL, proporcionando uma API escalável e eficiente. Ele é integrado à API do TMDb para fornecer informações atualizadas sobre filmes e séries, e também utiliza as APIs do Ingresso.com e OpenCage API para redirecionamento para cinemas e calculo de localidade, respectivamente. Além de oferecer um sistema de recomendação baseado nas preferências do usuário.

A documentação da API pode ser acessada via Swagger, permitindo fácil exploração dos endpoints e testes rápidos. Com suporte a JWT para autenticação e Prisma como ORM, o sistema garante segurança e eficiência no gerenciamento de dados.

Este projeto será hospedado na Heroku, facilitando o deployment e a escalabilidade. 🚀