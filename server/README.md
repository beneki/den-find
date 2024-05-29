## 🚀 How to use

- Update your credentials for PostgreSQL DB in ormconfig.json file

```sh
{
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "your_db_username",
    "password": "your_db_password",
    "database": "your_db_name",
    "synchronize": true,
    "logging": false,
    "entities": [
        "src/entity/**/*.ts"
    ]
}
```

- And then run:

```sh
pnpm install
pnpm ts-node ./src/index.ts
```


