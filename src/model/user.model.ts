import { Schema, Types, model } from 'mongoose';
import validator from 'validator';

interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

interface IUser {
  name: string;
  username?: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  googleId?: string;
  profileImg?: string;
  wishlists: ICartItem[];
  cartItems: ICartItem[];
  resetToken?: string | undefined;
  resetTokenExpires?: Date | undefined;
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
        productId: { type: Types.ObjectId, ref: 'Product' },
        quantity: Number,
      },
    ],

    default: [],
  },

  cartItems: {
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product' },
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

const User = model<IUser>('user', userSchema);

export default User;
