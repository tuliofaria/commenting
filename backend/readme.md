# Backend.

Running migrations:

```
npx knex --knexfile=./src/knexfile.ts migrate:latest

// on heroku
npx knex --knexfile=./dist/knexfile.js migrate:latest
```

