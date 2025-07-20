import {Router} from 'express';
import {loginUser, registerUser} from "../controllers/auth.controllers.js";

export const authRouter: Router = Router();

authRouter.route('/register').post(registerUser);
authRouter.route('/login').post(loginUser);