"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
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
    },
    password: {
        type: String,
        minlength: 6,
        required: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    googleId: {
        type: String,
    },
    profileImg: {
        type: String,
    },
    wishlists: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Wishlist',
        },
    ],
    cartItems: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'CartItem',
        },
    ],
});
var User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
