"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const argon2_1 = __importDefault(require("argon2"));
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const LoginInput_1 = require("../types/LoginInput");
const RegisterInput_1 = require("../types/RegisterInput");
const UserMutationReponse_1 = require("../types/UserMutationReponse");
const authToken_1 = require("../utils/authToken");
const typeorm_1 = require("typeorm");
const SearchResultUnion = (0, type_graphql_1.createUnionType)({
    name: "SearchResult",
    types: () => [User_1.User],
    resolveType: (value) => {
        if ("username" in value) {
            return "User";
        }
        return undefined;
    },
});
let UserResolver = class UserResolver {
    async getAllUser() {
        const users = await User_1.User.find();
        return users;
    }
    async search(pharse) {
        try {
            if (pharse !== "") {
                const names = await User_1.User.find({
                    where: {
                        username: (0, typeorm_1.Like)(`%${pharse}%`),
                    },
                });
                return [...names];
            }
            return [];
        }
        catch (err) {
            console.log(err);
            throw new Error("Could not find user");
        }
    }
    async register(registerInput) {
        const { username, password } = registerInput;
        if (!username || !password) {
            return {
                code: 400,
                success: false,
                message: "Please enter a username or password",
            };
        }
        const existingUser = await User_1.User.findOne({
            where: {
                username: username,
            },
        });
        if (existingUser) {
            return {
                code: 400,
                success: false,
                message: "Username already exists",
            };
        }
        const hash = await argon2_1.default.hash(password);
        const newUser = User_1.User.create({
            username,
            password: hash,
        });
        await newUser.save();
        return {
            code: 200,
            success: true,
            message: "User registered successfully",
            user: newUser,
        };
    }
    async login(loginInput, { res }) {
        try {
            const { username, password } = loginInput;
            const existingUser = await User_1.User.findOne({
                where: {
                    username,
                },
            });
            if (!existingUser) {
                return {
                    code: 400,
                    success: false,
                    message: "User not found",
                };
            }
            const isvalidPassword = await argon2_1.default.verify(existingUser.password, password);
            if (!isvalidPassword) {
                return {
                    code: 400,
                    success: false,
                    message: "Wrong Password",
                };
            }
            (0, authToken_1.createRefreshToken)(res, existingUser);
            return {
                code: 200,
                success: true,
                message: "Login successful",
                user: existingUser,
                accessToken: (0, authToken_1.createToken)("accessToken", existingUser),
            };
        }
        catch (error) {
            console.log(error);
            throw new Error("Something is Wrong!");
        }
    }
    async logout(userId, { res }) {
        const existinguser = await User_1.User.findOne({
            where: {
                id: userId,
            },
        });
        if (!existinguser) {
            return {
                code: 400,
                success: false,
            };
        }
        existinguser.tokenVersion += 1;
        await existinguser.save();
        res.clearCookie(process.env.REFRESH_TOKEN_NAME, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/refresh_token",
        });
        return {
            code: 200,
            success: true,
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getAllUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => [SearchResultUnion]),
    __param(0, (0, type_graphql_1.Arg)("pharse")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "search", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserMutationReponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("registerInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput_1.RegisterInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserMutationReponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("loginInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserMutationReponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("userId", (_type) => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(UserMutationReponse_1.UserMutationResponse)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map