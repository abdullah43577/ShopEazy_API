"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var PORT = (process.env || 4000).PORT;
var connectDB_1 = require("./utils/connectDB");
var cors_1 = __importDefault(require("cors"));
var authRoutes_1 = __importDefault(require("./routes/authRoutes"));
var app = (0, express_1.default)();
// middleware
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)({
    methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
    origin: '*',
}));
app.listen(PORT, function () {
    (0, connectDB_1.connectDB)();
    console.log("Server is running on port http://localhost:".concat(PORT));
});
app.use(authRoutes_1.default);
