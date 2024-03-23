"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var validator_1 = __importDefault(require("validator"));
var userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (value) { return validator_1.default.isEmail(value); },
            message: 'Please provide a valid email address',
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) { return validator_1.default.isLength(value, { min: 6 }); },
            message: 'Password must be at least 6 characters long',
        },
    },
    phone: {
        type: String,
        unique: true,
    },
    address: {
        type: String,
    },
    googleId: {
        type: String,
        default: null,
    },
    profileImg: {
        type: String,
        default: null,
    },
    wishlists: {
        type: [
            {
                productId: { type: mongoose_1.Types.ObjectId, ref: 'Product' },
                quantity: Number,
            },
        ],
        default: [],
    },
    cartItems: {
        type: [
            {
                productId: { type: mongoose_1.Types.ObjectId, ref: 'Product' },
                quantity: Number,
            },
        ],
        default: [],
    },
    resetToken: {
        type: String,
    },
    resetTokenExpires: {
        type: Date,
    },
});
var User = (0, mongoose_1.model)('user', userSchema);
exports.default = User;
