import 'dotenv/config';
const { DB } = process.env;
import mongoose from 'mongoose';

export const connectDB = async () => {
  const dbURI = DB;

  try {
    await mongoose.connect(dbURI as string);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Error connecting to MongoDB', err);
  }
};
