import { Router } from 'express';
import { test, register, updateProfile, login, populateProducts, forgotPassword, resetPassword, getuser, updateDispatchAction, getProducts, getSingleProduct, dispatchFilter, getDispatchedActions } from '../controllers/authControllers';
import { validateToken } from '../utils/validateToken';

const authRoutes = Router();

authRoutes.get('/', test);
authRoutes.get('/getuser/:id', getuser);
authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/update-profile', validateToken, updateProfile);
authRoutes.post('/upload', populateProducts);
authRoutes.post('/forgot-password/:id', validateToken, forgotPassword);
authRoutes.post('/reset-password/:resetToken', validateToken, resetPassword);
authRoutes.post('/update-dispatch-items/:userId', validateToken, updateDispatchAction);
authRoutes.get('/products', getProducts);
authRoutes.get('/products/:id', getSingleProduct);
authRoutes.get('/products/filter/:filterType', dispatchFilter);
authRoutes.get('/get_actions/:actionType/:userId', getDispatchedActions);

export default authRoutes;
