import "reflect-metadata";
import { DataSource } from "typeorm";
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";

const ORMConfig = require('../ormconfig.json');
export const AppDataSource = new DataSource(ORMConfig)
AppDataSource.initialize()
    .then(() => {
        const app = express();
        const PORT = process.env.PORT || 3000;

        app.use(bodyParser.json());
        app.use("/api", routes);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => console.log(error))