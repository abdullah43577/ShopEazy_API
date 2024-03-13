"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authControllers_1 = require("../controllers/authControllers");
var authRoutes = (0, express_1.Router)();
authRoutes.get('/', authControllers_1.test);
authRoutes.post('/register', authControllers_1.register);
authRoutes.post('/login', authControllers_1.login);
exports.default = authRoutes;
