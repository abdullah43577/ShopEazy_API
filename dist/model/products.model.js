"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var productsModel = new mongoose_1.Schema({
    category: String,
    description: String,
    id: Number,
    image: String,
    price: Number,
    rating: {
        rate: Number,
        count: Number,
    },
    title: String,
    isAddedToWishlist: Boolean,
    isAddedToCart: Boolean,
    quantity: Number,
});
var Product = (0, mongoose_1.model)('product', productsModel);
exports.default = Product;
