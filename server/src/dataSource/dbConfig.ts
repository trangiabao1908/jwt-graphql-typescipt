import { DataSource } from "typeorm";
import { User } from "../entities/User";
require("dotenv").config();
function dbConfig() {
  const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "jwt-graphql-typescript",
    entities: [User],
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

export default dbConfig;
