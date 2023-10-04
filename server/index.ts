import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import http from "http";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import dbConfig from "./src/dataSource/dbConfig";
import { GreetingResolver } from "./src/resolvers/greeting";
import { UserResolver } from "./src/resolvers/user";
import refreshToken from "./src/routes/refreshToken";

const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();

const main = async () => {
  dbConfig();
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use("/refresh_token", refreshToken);
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [GreetingResolver, UserResolver],
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  const PORT = process.env.PORT || 4000;
  app.use(
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
      }),
    })
  );
  await new Promise((resolve) =>
    httpServer.listen({ port: PORT }, resolve as () => void)
  );
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
};
main().catch((error) => console.log("ERROR STARTING SERVER: ", error));
