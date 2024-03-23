import { Request, Response } from 'express';
import User from '../model/user.model';
import { generatetoken } from '../utils/generateToken';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { isValidObjectId, Types } from 'mongoose';
import 'dotenv/config';
const { STORE_API } = process.env;
import axios from 'axios';
import Product from '../model/products.model';
import { sendMail } from '../utils/sendMail';
import validator from 'validator';

interface UpdateFields {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
}

const test = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Endpoint working successfully!' });
};

const getuser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'No user ID passed!' });

    const user = await User.findById(id);
    res.status(200).json({ message: 'Retrieved user successfully!', user });
  } catch (err) {
    res.status(404).json({ message: "Couldn't find user with associated ID" });
  }
};

const populateProducts = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get(STORE_API as string);
    const products = data.map((product: Record<any, any>) => {
      const { id, ...rest } = product;

      return {
        ...rest,
        isAddedToWishlist: false,
        isAddedToCart: false,
        quantity: 1,
      };
    });

    const savedProducts = await Product.insertMany(products);

    res.status(200).json({ message: 'Products populated successfully!', data: savedProducts });
  } catch (error) {
    console.log('Error populating products', (error as Error).message);

    res.status(404).json({ message: 'Error populating products', error: (error as Error).message });
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required!' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'user with email already exists!' });

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = generatetoken(newUser._id.toString());
    res.cookie('shopEazyJWT', token, { httpOnly: true, secure: true, maxAge: 3600000 });

    res.status(201).json({ message: 'Account Registration Successful!', newUser, token });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error!', err: (err as Error).message });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    if (!id) return res.status(404).json({ message: 'Missing ID!' });

    const user = await User.findById(id);

    if (!user || !isValidObjectId(id)) return res.status(400).json({ message: 'Invalid User ID!' });

    // Update the user object with the provided fields
    for (const key in updateFields) {
      user[key as keyof UpdateFields] = updateFields[key];
    }

    await user.save();

    return res.status(200).json({ message: 'User profile updated successfully!', user });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error!', err: (err as Error).message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    // username property can either be of the type username or type email
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) return res.status(400).json({ message: 'Username or email and password are required!' });

    let user;

    if (validator.isEmail(usernameOrEmail)) {
      // check if username is provided
      user = await User.findOne({ email: usernameOrEmail });
    } else {
      // check if email was provided
      user = await User.findOne({ username: usernameOrEmail });
    }

    if (!user) return res.status(400).json({ message: 'Invalid username or email or password!' });

    // compare passwords
    const passwordMatch = await comparePassword(password, user.password as string);

    if (!passwordMatch) return res.status(400).json({ message: 'invalid username or email or password!' });

    const token = generatetoken(user._id.toString());
    res.cookie('shopEazyJWT', token, { httpOnly: true, secure: true, maxAge: 3600000 });

    res.status(200).json({ message: 'User log in successfull!', user, token });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error!', err: (err as Error).message });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail } = req.body;
    if (!usernameOrEmail) return res.sendStatus(404);

    let user;

    if (validator.isEmail(usernameOrEmail)) {
      user = await User.findOne({ email: usernameOrEmail });
    } else {
      user = await User.findOne({ username: usernameOrEmail });
    }

    if (!user) return res.status(404).json({ message: 'user with the associated email not registered!' });

    //? reset token would be sent to the user's email along side the reset link, the reset token is what we use to validate the reset password endpoint
    const resetToken = crypto.randomUUID().toString();
    const tokenExpiration = new Date(Date.now() + 3600000); // 1 hour
    user.resetToken = resetToken;
    user.resetTokenExpires = tokenExpiration;
    await user.save();

    // send mail to user
    const emailSent = await sendMail({ name: user.name, email: user.email, resetToken });

    if (emailSent) {
      res.status(200).json({ message: 'Password reset token generated and sent to the user!' });
    } else {
      res.status(500).json({ message: 'Failed to send password reset email. Please try again later.' });
    }
  } catch (err) {
    res.status(404).json({ message: 'An Error Occurred!!', error: (err as Error).message });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken } = req.params;
    const { email, newPassword } = req.body;

    if (!resetToken || !email || !newPassword) return res.status(400).json({ message: 'Invalid request. Reset token, email, and new password are required.' });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found!' });

    if (user.resetToken !== resetToken) return res.status(400).json({ message: 'Invalid reset token!' });

    if (!user.resetTokenExpires || user.resetTokenExpires < new Date(Date.now())) return res.status(400).json({ message: 'Reset token has expired!' });

    user.password = await hashPassword(newPassword);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful!' });
  } catch (err) {
    res.status(404).json({ message: 'Error resetting password', error: (err as Error).message });
  }
};

const updateDispatchAction = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { productId, stateType, productType } = req.body;

    // ? find corresponding user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ? find corresponding product
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // ? definition of types to work with
    const updateType = stateType as 'wishlists' | 'cartItems';
    const productProperty = productType as 'isAddedToWishlist' | 'isAddedToCart';

    // ?  check if product already exist
    const itemIndex = user[updateType].findIndex((obj) => obj.productId.equals(new Types.ObjectId(productId)));

    // ? if product exist, remove it, else add it
    if (itemIndex !== -1) {
      user[updateType].splice(itemIndex, 1);
      product[productProperty] = false;
      await Promise.all([user.save(), product.save()]);
      return res.status(204).json({ message: `Product removed from ${updateType} successfully!`, [updateType]: user[updateType] });
    }

    user[updateType].push({ productId, quantity: 1 });
    product[productProperty] = true;
    await Promise.all([user.save(), product.save()]);
    res.status(200).json({ message: `Product added to ${updateType} successfully!`, [updateType]: user[updateType] });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', err: (err as Error).message });
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ message: 'Product fetched successfully!', products });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching products', err: (err as Error).message });
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({ message: 'Product retrieved successfully!', product });
  } catch (err) {
    res.status(400).json({ message: 'Error getting product', err: (err as Error).message });
  }
};

export { test, getuser, register, updateProfile, login, populateProducts, forgotPassword, resetPassword, updateDispatchAction, getProducts, getSingleProduct };
