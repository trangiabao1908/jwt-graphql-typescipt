"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const dbConfig_1 = __importDefault(require("./src/dataSource/dbConfig"));
const greeting_1 = require("./src/resolvers/greeting");
const user_1 = require("./src/resolvers/user");
const refreshToken_1 = __importDefault(require("./src/routes/refreshToken"));
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
require("dotenv").config();
const main = async () => {
    (0, dbConfig_1.default)();
    const app = express();
    app.use(cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }));
    app.use(cookieParser());
    app.use(body_parser_1.default.json());
    app.use("/refresh_token", refreshToken_1.default);
    const httpServer = http_1.default.createServer(app);
    const server = new server_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            validate: false,
            resolvers: [greeting_1.GreetingResolver, user_1.UserResolver],
        }),
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    });
    await server.start();
    const PORT = process.env.PORT || 4000;
    app.use((0, express4_1.expressMiddleware)(server, {
        context: async ({ req, res }) => ({
            req,
            res,
        }),
    }));
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
};
main().catch((error) => console.log("ERROR STARTING SERVER: ", error));
//# sourceMappingURL=index.js.map