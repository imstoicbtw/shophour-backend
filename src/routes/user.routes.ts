import { Router } from 'express';
import { ROLES } from "../constants.js";
import {
    addNewAddress,
    deleteMyAddress,
    getCurrentUser,
    getCustomers,
    getManagers,
    getMyAddresses,
    updateCurrentUserAvatar,
    updateCurrentUserDetails,
    updatePassword
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateBody } from '../middlewares/validate-body.middleware.js';
import { addNewAddressReqBody, updatePasswordReqBody } from '../zod/requests/user.zod.js';

export const userRouter: Router = Router();


userRouter.route("/current-user")
    .get(authenticate, getCurrentUser)
    .patch(authenticate, updateCurrentUserDetails);

userRouter.route("/current-user/avatar")
    .patch(authenticate, updateCurrentUserAvatar);

userRouter.route("/current-user/password")
    .patch(authenticate, validateBody(updatePasswordReqBody), updatePassword);

userRouter.route("/current-user/addresses")
    .get(authenticate, getMyAddresses)
    .post(authenticate, validateBody(addNewAddressReqBody), addNewAddress)
    .delete(authenticate, deleteMyAddress);

userRouter.route("/get-customers")
    .get(authenticate, authorize(ROLES.Admin, ROLES.Manager), getCustomers);

userRouter.route("/get-managers")
    .get(authenticate, authorize(ROLES.Admin), getManagers);

