"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const type_graphql_1 = require("type-graphql");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthMiddleware = async ({ context }, next) => {
    try {
        const accessTokenHeader = context.req.header("Authorization");
        const accessToken = accessTokenHeader && accessTokenHeader.split(" ")[1];
        if (!accessToken) {
            throw new type_graphql_1.AuthenticationError("Not authenticated");
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESSTOKEN_SECRET);
        context.user = decoded;
        return next();
    }
    catch (err) {
        throw new type_graphql_1.AuthenticationError(`Failed to authenticate, ${err.message}`);
    }
};
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map