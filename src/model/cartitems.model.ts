import { Schema, model } from 'mongoose';

const cartItems = new Schema({
  cartItems: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
});

const CartItem = model('cartItem', cartItems);

export default CartItem;
