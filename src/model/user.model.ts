import { Schema, model } from 'mongoose';

interface ICartItem {
  productId: number;
  quantity: number;
}

interface IUser {
  name: string;
  username?: string;
  email: string;
  password: string;
  phone?: string;
  googleId?: string;
  profileImg?: string;
  wishlists: ICartItem[];
  cartItems: ICartItem[];
}

const userSchema = new Schema<IUser>({
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
      type: Schema.Types.ObjectId,
      ref: 'Wishlist',
    },
  ],

  cartItems: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CartItem',
    },
  ],
});

const User = model<IUser>('User', userSchema);

export default User;
