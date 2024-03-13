"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.updateProfile = exports.register = exports.test = void 0;
var UserModel_1 = __importDefault(require("../model/UserModel"));
var generateToken_1 = require("../utils/generateToken");
var hashPassword_1 = require("../utils/hashPassword");
var mongoose_1 = require("mongoose");
var test = function (req, res) {
    res.status(200).json({ message: 'Endpoint working successfully!' });
};
exports.test = test;
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, existingUser, hashedPassword, newUser, token, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name = _a.name, email = _a.email, password = _a.password;
                if (!name || !email || !password)
                    return [2 /*return*/, res.status(400).json({ message: 'All fields are required!' })];
                return [4 /*yield*/, UserModel_1.default.findOne({ email: email })];
            case 1:
                existingUser = _b.sent();
                if (existingUser)
                    return [2 /*return*/, res.status(400).json({ message: 'email already exists!' })];
                return [4 /*yield*/, (0, hashPassword_1.hashPassword)(password)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, UserModel_1.default.create({ name: name, email: email, password: hashedPassword })];
            case 3:
                newUser = _b.sent();
                token = (0, generateToken_1.generatetoken)(newUser._id.toString());
                res.cookie('shopEazyJWT', token, { httpOnly: true, secure: true, maxAge: 3600000 });
                res.status(201).json({ message: 'User successfully created!', newUser: newUser });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                res.status(500).json({ message: 'Internal server error!', err: err_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var updateProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, phone, id, isValidUser, user, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, username = _a.username, phone = _a.phone;
                id = req.params.id;
                return [4 /*yield*/, UserModel_1.default.findById(id)];
            case 1:
                isValidUser = _b.sent();
                if (!isValidUser || !(0, mongoose_1.isValidObjectId)(id))
                    return [2 /*return*/, res.status(400).json({ message: 'User does not exist!' })];
                return [4 /*yield*/, UserModel_1.default.findByIdAndUpdate(id, { username: username, phone: phone }, { new: true })];
            case 2:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(400).json({ message: 'User does not exist!' })];
                return [2 /*return*/, res.status(200).json({ message: 'User successfully updated!', user: user })];
            case 3:
                err_2 = _b.sent();
                res.status(500).json({ message: 'Internal server error!', err: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateProfile = updateProfile;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, passwordMatch, token, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, username = _a.username, password = _a.password;
                if (!username || !password)
                    return [2 /*return*/, res.status(400).json({ message: 'All fields are required!' })];
                return [4 /*yield*/, UserModel_1.default.findOne({ username: username })];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid username or password!' })];
                return [4 /*yield*/, (0, hashPassword_1.comparePassword)(password, user.password)];
            case 2:
                passwordMatch = _b.sent();
                if (!passwordMatch)
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid username or password!' })];
                token = (0, generateToken_1.generatetoken)(user._id.toString());
                res.cookie('shopEazyJWT', token, { httpOnly: true, secure: true, maxAge: 3600000 });
                res.status(200).json({ message: 'User successfully logged in!', user: user });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                res.status(500).json({ message: 'Internal server error!', err: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
