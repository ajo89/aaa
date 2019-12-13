<!-- markdownlint-disable MD033 MD036 -->

<div align=center>

# @acme-bookshop/backend

_Backend app for Acme Bookshop_

This is a boilerplate repo for [DCDC bootcamp participants](http://dilo.id/Event/Detail/551). Finished app will be published after the bootcamp final day (Sunday, 15 December 2019).

</div>

## Prerequisites

- Node.js >10 and latest npm
- MongoDB instance
- (optional) Docker and docker-compose

## Development

### First steps

1. `git clone https://github.com/acme-bookshop/backend.git acme-bookshop-backend`
2. `cd acme-bookshop-backend`
3. `npm install`
4. Copy `.env.example` to `.env` and configure env vars

### Express routers

Routers are dynamically imported from `src/routes`, so you don't need to `app.use()` one by one. Make sure that the router is exported (`module.exports = router`).

### Database instance

This repo includes `docker-compose.yml` which runs both the database and build the server app. You can use your own database instance and set the `.env` accordingly, or use `npm run start:db` which runs `docker-compose up -d acme_database` using Docker.

### Starting server

This repo includes `docker-compose.yml` which runs both the database and build the server app. To run manually, make sure the database instance is running and execute `npm start` or `npm watch`.

## Configuration

```bash
# express server port and secret key
APP_PORT=3000
APP_SECRET=supersecret

# mongodb hostname, port, and database name
DB_HOST=localhost
DB_PORT=27017
DB_DATABASE=acme-bookshop
```

## Notes

- Project is `npm` based; `yarn` is optional but using `npm` is recommended since `package-lock.json` is commited
- Project includes pre-commit git hook using `husky` which runs `npm run format`

Happy hacking! 🎉
