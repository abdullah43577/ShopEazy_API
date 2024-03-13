"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatetoken = void 0;
require("dotenv/config");
var ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var generatetoken = function (id) {
    return jsonwebtoken_1.default.sign({ id: id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};
exports.generatetoken = generatetoken;
