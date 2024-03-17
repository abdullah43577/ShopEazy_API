import { Schema, model } from 'mongoose';
import validator from 'validator';

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
  resetToken?: string;
  resetTokenExpires?: Date;
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
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Please provide a valid email address',
    },
  },

  password: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isLength(value, { min: 6 }),
      message: 'Password must be at least 6 characters long',
    },
  },

  phone: {
    type: String,
    unique: true,
  },

  googleId: {
    type: String,
    default: null,
  },

  profileImg: {
    type: String,
    default: null,
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

  resetToken: {
    type: String,
    default: null,
  },

  resetTokenExpires: {
    type: Date,
    default: null,
  },
});

const User = model<IUser>('user', userSchema);

export default User;
