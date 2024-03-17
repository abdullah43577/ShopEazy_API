import { Request, Response } from 'express';
import User from '../model/user.model';
import { generatetoken } from '../utils/generateToken';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { isValidObjectId } from 'mongoose';
import 'dotenv/config';
const { STORE_API } = process.env;
import axios from 'axios';
import Product from '../model/products.model';

const test = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Endpoint working successfully!' });
};

const populateProducts = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get(STORE_API as string);
    const products = data.map((product: Record<any, any>) => ({
      ...product,
      isAddedToWishlist: false,
      isAddedToCart: false,
      quantity: 1,
    }));

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

    res.status(201).json({ message: 'Account Registration Successful!', newUser });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error!', err: (err as Error).message });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const { username, phone, profileImg } = req.body;
    const { id } = req.params;

    const isValidUser = await User.findById(id);

    if (!isValidUser || !isValidObjectId(id)) return res.status(400).json({ message: 'User does not exist!' });

    const user = await User.findByIdAndUpdate(id, { username, phone, profileImg }, { new: true });

    if (!user) return res.status(400).json({ message: 'User does not exist!' });

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

    if (usernameOrEmail.includes('@')) {
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

    res.status(200).json({ message: 'User log in successfull!', user });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error!', err: (err as Error).message });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail } = req.body;
    if (!usernameOrEmail) return res.sendStatus(404);

    let user;

    if (usernameOrEmail.includes('@')) {
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

    res.status(200).json({ message: 'Password reset token generated and sent to the User!' });
  } catch (err) {
    res.status(404).json({ message: 'An Error Occurred!!', error: (err as Error).message });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: 'New password is required!' });
  } catch (err) {
    res.status(404).json({ messag: 'Error resetting password', error: (err as Error).message });
  }
};

export { test, register, updateProfile, login, populateProducts, forgotPassword };
