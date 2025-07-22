import { Router } from 'express';
import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { validateBody } from '../middlewares/validate-body.middleware.js';
import { loginUserReqBody, registerUserReqBody } from '../zod/requests/auth.zod.js';

export const authRouter: Router = Router();

authRouter.route('/register')
    .post(
        validateBody(registerUserReqBody),
        registerUser
    );

authRouter.route('/login')
    .post(
        validateBody(loginUserReqBody),
        loginUser
    );