import { Schema, model } from 'mongoose';

const wishlistsModel = new Schema({
  wishlists: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
});

const Wishlist = model('wishlist', wishlistsModel);

export default Wishlist;
