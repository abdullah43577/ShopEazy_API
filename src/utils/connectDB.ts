import 'dotenv/config';
const { DB_PASSWORD } = process.env;
import mongoose from 'mongoose';

export const connectDB = async () => {
  const dbURI = `mongodb+srv://officialayo540:${DB_PASSWORD}@quikchatcluster.wdvm6cm.mongodb.net/quikChatDB`;

  try {
    await mongoose.connect(dbURI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Error connecting to MongoDB', err);
  }
};
