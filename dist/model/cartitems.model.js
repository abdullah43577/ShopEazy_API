"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var cartItems = new mongoose_1.Schema({
    cartItems: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
});
var CartItem = (0, mongoose_1.model)('cartItem', cartItems);
exports.default = CartItem;
