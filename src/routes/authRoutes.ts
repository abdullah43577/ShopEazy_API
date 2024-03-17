import { Router } from 'express';
import { test, register, updateProfile, login, populateProducts, forgotPassword, resetPassword } from '../controllers/authControllers';
import { validateToken } from '../utils/validateToken';

const authRoutes = Router();

authRoutes.get('/', test);
authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/update-profile', validateToken, updateProfile);
authRoutes.post('/upload', populateProducts);
authRoutes.post('/forgot-password/:id', validateToken, forgotPassword);
authRoutes.post('/reset-password/:resetToken', validateToken, resetPassword);

export default authRoutes;
