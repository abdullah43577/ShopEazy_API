"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
require("dotenv/config");
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var validateToken = function (req, res, next) {
    var _a;
    var token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    // If token is not found in headers, try to find it in cookies
    if (!token && req.cookies) {
        token = req.cookies['shopEazyJWT'];
    }
    if (!token)
        return res.status(401).json({ message: 'Access Denied, No token provided!' });
    try {
        var verifiedToken = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Unauthorized Access!' });
    }
};
exports.validateToken = validateToken;
