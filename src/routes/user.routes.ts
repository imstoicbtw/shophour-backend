import { Router } from 'express';
import { ROLES } from "../constants.js";
import {
    addNewAddress,
    addToCart,
    clearCart,
    deleteMyAddress,
    getCart,
    getCurrentUser,
    getCustomers,
    getManagers,
    getMyAddresses,
    removeItemFromCart,
    updateCartItemQuantity,
    updateCurrentUserAvatar,
    updateCurrentUserDetails,
    updateMyAddress,
    updatePassword
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateBody } from '../middlewares/validate-body.middleware.js';
import { addNewAddressReqBody, addToCartReqBody, updatePasswordReqBody } from '../zod/requests/user.zod.js';

export const userRouter: Router = Router();


// ~ USER 
userRouter.route("/current-user")
    .get(
        authenticate,
        getCurrentUser
    ).patch(
        authenticate,
        updateCurrentUserDetails
    );

userRouter.route("/current-user/avatar")
    .patch(
        authenticate,
        updateCurrentUserAvatar
    );

userRouter.route("/current-user/password")
    .patch(
        authenticate,
        validateBody(updatePasswordReqBody),
        updatePassword
    );


// ~ ADDRESSES 
userRouter.route("/current-user/addresses")
    .get(
        authenticate,
        getMyAddresses
    ).post(
        authenticate,
        validateBody(addNewAddressReqBody),
        addNewAddress
    );

userRouter.route("/current-user/addresses/:addressId")
    .patch(
        authenticate,
        validateBody(addNewAddressReqBody.partial()),
        updateMyAddress
    ).delete(
        authenticate,
        deleteMyAddress
    );


// ~ CART 

userRouter.route("/current-user/cart")
    .get(
        authenticate,
        getCart
    ).post(
        authenticate,
        validateBody(addToCartReqBody),
        addToCart
    ).delete(
        authenticate,
        clearCart
    );

userRouter.route("/current-user/cart/:cartItemId")
    .patch(
        authenticate,
        validateBody(addToCartReqBody.pick({ quantity: true })),
        updateCartItemQuantity
    ).delete(
        authenticate,
        removeItemFromCart
    );


// ~ ADMIN ROUTES 

userRouter.route("/get-customers")
    .get(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        getCustomers
    );

userRouter.route("/get-managers")
    .get(
        authenticate,
        authorize(ROLES.Admin),
        getManagers
    );

