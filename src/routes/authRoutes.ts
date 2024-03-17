import { Router } from 'express';
import { test, register, updateProfile, login, populateProducts, forgotPassword } from '../controllers/authControllers';

const authRoutes = Router();

authRoutes.get('/', test);
authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/update-profile', updateProfile);
authRoutes.post('/upload', populateProducts);
authRoutes.post('/forgot-password', forgotPassword);

export default authRoutes;
