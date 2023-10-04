"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../src/entities/User");
const authToken_1 = require("../src/utils/authToken");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME];
    if (!refreshToken)
        return res.sendStatus(401);
    try {
        console.log(process.env.REFRESH_TOKEN_SECRET);
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const existingUser = await User_1.User.findOne({
            where: {
                id: decoded.userId,
            },
        });
        if (!existingUser) {
            return res.sendStatus(401);
        }
        (0, authToken_1.createRefreshToken)(res, existingUser);
        return res.json({
            success: true,
            accessToken: (0, authToken_1.createToken)("accessToken", existingUser),
        });
    }
    catch (err) {
        console.log(err.message);
        return res.sendStatus(403);
    }
});
exports.default = router;
//# sourceMappingURL=refreshToken.js.map