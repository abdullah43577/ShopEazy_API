import { Router } from 'express';
import { test, register, updateProfile, login } from '../controllers/authControllers';

const authRoutes = Router();

authRoutes.get('/', test);
authRoutes.post('/register', register);
authRoutes.post('/login', login);

export default authRoutes;
