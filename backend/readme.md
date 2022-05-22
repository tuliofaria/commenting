# Backend.

Running migrations:

```
npx knex --knexfile=./src/knexfile.ts migrate:latest

// on heroku
npx knex --knexfile=./dist/knexfile.js migrate:latest
```

## Running the project on HerokuÇ

In order to run this backend on Heroku, you need to install the following build add on.

https://github.com/timanovsky/subdir-heroku-buildpack

Why? Since the backend is in a subdirectory, the regular way of deploying is not going to work.
