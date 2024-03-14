"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var wishlistsModel = new mongoose_1.Schema({
    wishlists: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
});
var Wishlist = (0, mongoose_1.model)('Wishlist', wishlistsModel);
exports.default = Wishlist;
