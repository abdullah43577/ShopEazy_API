"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.resetPassword = exports.forgotPassword = exports.populateProducts = exports.login = exports.updateProfile = exports.register = exports.getuser = exports.test = void 0;
var user_model_1 = __importDefault(require("../model/user.model"));
var generateToken_1 = require("../utils/generateToken");
var hashPassword_1 = require("../utils/hashPassword");
var mongoose_1 = require("mongoose");
require("dotenv/config");
var STORE_API = process.env.STORE_API;
var axios_1 = __importDefault(require("axios"));
var products_model_1 = __importDefault(require("../model/products.model"));
var sendMail_1 = require("../utils/sendMail");
var validator_1 = __importDefault(require("validator"));
var test = function (req, res) {
    res.status(200).json({ message: 'Endpoint working successfully!' });
};
exports.test = test;
var getuser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                if (!id)
                    return [2 /*return*/, res.status(400).json({ message: 'No user ID passed!' })];
                return [4 /*yield*/, user_model_1.default.findById(id)];
            case 1:
                user = _a.sent();
                res.status(200).json({ message: 'Retrieved user successfully!', user: user });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(404).json({ message: "Couldn't find user with associated ID" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getuser = getuser;
var populateProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, products, savedProducts, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(STORE_API)];
            case 1:
                data = (_a.sent()).data;
                products = data.map(function (product) { return (__assign(__assign({}, product), { isAddedToWishlist: false, isAddedToCart: false, quantity: 1 })); });
                return [4 /*yield*/, products_model_1.default.insertMany(products)];
            case 2:
                savedProducts = _a.sent();
                res.status(200).json({ message: 'Products populated successfully!', data: savedProducts });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log('Error populating products', error_1.message);
                res.status(404).json({ message: 'Error populating products', error: error_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.populateProducts = populateProducts;
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, password, existingUser, hashedPassword, newUser, token, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name = _a.name, email = _a.email, password = _a.password;
                if (!name || !email || !password)
                    return [2 /*return*/, res.status(400).json({ message: 'All fields are required!' })];
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                existingUser = _b.sent();
                if (existingUser)
                    return [2 /*return*/, res.status(400).json({ message: 'user with email already exists!' })];
                return [4 /*yield*/, (0, hashPassword_1.hashPassword)(password)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, user_model_1.default.create({ name: name, email: email, password: hashedPassword })];
            case 3:
                newUser = _b.sent();
                token = (0, generateToken_1.generatetoken)(newUser._id.toString());
                res.cookie('shopEazyJWT', token, { httpOnly: true, secure: true, maxAge: 3600000 });
                res.status(201).json({ message: 'Account Registration Successful!', newUser: newUser, token: token });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _b.sent();
                res.status(500).json({ message: 'Internal server error!', err: err_2.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var updateProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateFields, user, key, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                updateFields = req.body;
                if (!id)
                    return [2 /*return*/, res.status(404).json({ message: 'Missing ID!' })];
                return [4 /*yield*/, user_model_1.default.findById(id)];
            case 1:
                user = _a.sent();
                if (!user || !(0, mongoose_1.isValidObjectId)(id))
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid User ID!' })];
                // Update the user object with the provided fields
                for (key in updateFields) {
                    user[key] = updateFields[key];
                }
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({ message: 'User profile updated successfully!', user: user })];
            case 3:
                err_3 = _a.sent();
                res.status(500).json({ message: 'Internal server error!', err: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateProfile = updateProfile;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, usernameOrEmail, password, user, passwordMatch, token, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, usernameOrEmail = _a.usernameOrEmail, password = _a.password;
                if (!usernameOrEmail || !password)
                    return [2 /*return*/, res.status(400).json({ message: 'Username or email and password are required!' })];
                user = void 0;
                if (!validator_1.default.isEmail(usernameOrEmail)) return [3 /*break*/, 2];
                return [4 /*yield*/, user_model_1.default.findOne({ email: usernameOrEmail })];
            case 1:
                // check if username is provided
                user = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, user_model_1.default.findOne({ username: usernameOrEmail })];
            case 3:
                // check if email was provided
                user = _b.sent();
                _b.label = 4;
            case 4:
                if (!user)
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid username or email or password!' })];
                return [4 /*yield*/, (0, hashPassword_1.comparePassword)(password, user.password)];
            case 5:
                passwordMatch = _b.sent();
                if (!passwordMatch)
                    return [2 /*return*/, res.status(400).json({ message: 'invalid username or email or password!' })];
                token = (0, generateToken_1.generatetoken)(user._id.toString());
                res.cookie('shopEazyJWT', token, { httpOnly: true, secure: true, maxAge: 3600000 });
                res.status(200).json({ message: 'User log in successfull!', user: user, token: token });
                return [3 /*break*/, 7];
            case 6:
                err_4 = _b.sent();
                res.status(500).json({ message: 'Internal server error!', err: err_4.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usernameOrEmail, user, resetToken, tokenExpiration, emailSent, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                usernameOrEmail = req.body.usernameOrEmail;
                if (!usernameOrEmail)
                    return [2 /*return*/, res.sendStatus(404)];
                user = void 0;
                if (!validator_1.default.isEmail(usernameOrEmail)) return [3 /*break*/, 2];
                return [4 /*yield*/, user_model_1.default.findOne({ email: usernameOrEmail })];
            case 1:
                user = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, user_model_1.default.findOne({ username: usernameOrEmail })];
            case 3:
                user = _a.sent();
                _a.label = 4;
            case 4:
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: 'user with the associated email not registered!' })];
                resetToken = crypto.randomUUID().toString();
                tokenExpiration = new Date(Date.now() + 3600000);
                user.resetToken = resetToken;
                user.resetTokenExpires = tokenExpiration;
                return [4 /*yield*/, user.save()];
            case 5:
                _a.sent();
                return [4 /*yield*/, (0, sendMail_1.sendMail)({ name: user.name, email: user.email, resetToken: resetToken })];
            case 6:
                emailSent = _a.sent();
                if (emailSent) {
                    res.status(200).json({ message: 'Password reset token generated and sent to the user!' });
                }
                else {
                    res.status(500).json({ message: 'Failed to send password reset email. Please try again later.' });
                }
                return [3 /*break*/, 8];
            case 7:
                err_5 = _a.sent();
                res.status(404).json({ message: 'An Error Occurred!!', error: err_5.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.forgotPassword = forgotPassword;
var resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var resetToken, _a, email, newPassword, user, _b, err_6;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                resetToken = req.params.resetToken;
                _a = req.body, email = _a.email, newPassword = _a.newPassword;
                if (!resetToken || !email || !newPassword)
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid request. Reset token, email, and new password are required.' })];
                return [4 /*yield*/, user_model_1.default.findOne({ email: email })];
            case 1:
                user = _c.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).json({ message: 'User not found!' })];
                if (user.resetToken !== resetToken)
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid reset token!' })];
                if (!user.resetTokenExpires || user.resetTokenExpires < new Date(Date.now()))
                    return [2 /*return*/, res.status(400).json({ message: 'Reset token has expired!' })];
                _b = user;
                return [4 /*yield*/, (0, hashPassword_1.hashPassword)(newPassword)];
            case 2:
                _b.password = _c.sent();
                user.resetToken = undefined;
                user.resetTokenExpires = undefined;
                return [4 /*yield*/, user.save()];
            case 3:
                _c.sent();
                res.status(200).json({ message: 'Password reset successful!' });
                return [3 /*break*/, 5];
            case 4:
                err_6 = _c.sent();
                res.status(404).json({ message: 'Error resetting password', error: err_6.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.resetPassword = resetPassword;
