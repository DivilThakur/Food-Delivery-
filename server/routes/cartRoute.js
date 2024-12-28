import express from 'express'
import { addToCart, deletCart, getCart, removeFromCart, removeItem } from '../controllers/cartController.js';
import { checkAuth } from '../middlewares/auth.js';

const cartRoute = express.Router();

cartRoute.post('/add', checkAuth, addToCart);
cartRoute.post('/remove', checkAuth, removeFromCart);
cartRoute.post('/removeItem', checkAuth, removeItem);
cartRoute.post('/delete', checkAuth, deletCart);
cartRoute.get('/getCart', checkAuth, getCart)

export default cartRoute;