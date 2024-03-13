import { Request, Response } from 'express';
import User from '../model/user.model';
import { generatetoken } from '../utils/generateToken';
import { comparePassword, hashPassword } from '../utils/hashPassword';
import { isValidObjectId } from 'mongoose';
import 'dotenv/config';
const { API_URL } = process.env;
import axios from 'axios';
import Product from '../model/Products.model';

const test = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Endpoint working successfully!' });
};

const populateProducts = async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get(API_URL as string);

    for (const product of data) {
      const productInstance = new Product(product);
      await Product.save(productInstance);
    }
  } catch (error) {
    res.sendStatus(404);
  }
};

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required!' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'email already exists!' });

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = generatetoken(newUser._id.toString());
    res.cookie('shopEazyJWT', token, { httpOnly: true, secure: true, maxAge: 3600000 });

    res.status(201).json({ message: 'User successfully created!', newUser });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error!', err: (err as Error).message });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const { username, phone } = req.body;
    const { id } = req.params;

    const isValidUser = await User.findById(id);

    if (!isValidUser || !isValidObjectId(id)) return res.status(400).json({ message: 'User does not exist!' });

    const user = await User.findByIdAndUpdate(id, { username, phone }, { new: true });

    if (!user) return res.status(400).json({ message: 'User does not exist!' });

    return res.status(200).json({ message: 'User successfully updated!', user });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error!', err: (err as Error).message });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    // username property can either be of the type username or type email
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({ message: 'All fields are required!' });

    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: 'Invalid username or password!' });

    // compare passwords
    const passwordMatch = await comparePassword(password, user.password as string);

    if (!passwordMatch) return res.status(400).json({ message: 'Invalid username or password!' });

    const token = generatetoken(user._id.toString());
    res.cookie('shopEazyJWT', token, { httpOnly: true, secure: true, maxAge: 3600000 });

    res.status(200).json({ message: 'User successfully logged in!', user });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error!', err: (err as Error).message });
  }
};

export { test, register, updateProfile, login };
