"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const createToken = (type, user) => {
    const accessToken = jsonwebtoken_1.default.sign({
        userId: user.id,
        ...(type === "refreshToken" ? { tokenVersion: user.tokenVersion } : {}),
    }, type === "accessToken"
        ? process.env.ACCESSTOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: type === "accessToken" ? "15s" : "60m",
    });
    return accessToken;
};
exports.createToken = createToken;
const createRefreshToken = (res, user) => {
    res.cookie(process.env.REFRESH_TOKEN_NAME, (0, exports.createToken)("refreshToken", user), {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/refresh_token",
    });
};
exports.createRefreshToken = createRefreshToken;
//# sourceMappingURL=authToken.js.map