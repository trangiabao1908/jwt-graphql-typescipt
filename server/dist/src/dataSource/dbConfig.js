"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
require("dotenv").config();
function dbConfig() {
    const AppDataSource = new typeorm_1.DataSource({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "jwt-graphql-typescript",
        entities: [User_1.User],
        logging: true,
        synchronize: true,
    });
    AppDataSource.initialize()
        .then(() => {
        console.log("Data Source has been initialized!");
    })
        .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
}
exports.default = dbConfig;
//# sourceMappingURL=dbConfig.js.map