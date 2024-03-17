import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
const { PORT } = process.env || 4000;
import { connectDB } from './utils/connectDB';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    methods: ['GET', 'POST', 'UPDATE', 'DELETE'],
    origin: '*',
  })
);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port http://localhost:${PORT}`);
});

app.use(authRoutes);
