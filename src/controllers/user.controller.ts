import { Request, Response } from 'express';
import { boolean } from 'zod';
import { ROLES } from "../constants.js";
import AddressModel, { TAddress, TAddressLean } from "../models/subdocs/address.model.js";
import { CartItemModel, TCartItem, TCartItemLean } from '../models/subdocs/cart-item.model.js';
import { TUser, TUserLean, UserModel } from "../models/user.model.js";
import { updatePasswordReqBodyType } from '../zod/requests/user.zod.js';


// ~ ADMIN ROUTES 

/**
 * Get all customers.
 * @access [ admin, manager ]
 * GET /api/users/get-customers/
 */
export async function getCustomers(req: Request, res: Response): Promise<void> {
    const customers: Array<TUserLean> = await UserModel.find({ role: ROLES.Customer }, ["-password"]).lean({ virtuals: true });
    res.json({
        success: true,
        message: `${customers.length} customer(s) found.`,
        data: customers
    });
}


/**
 * Get all managers.
 * @access [ admin ]
 * GET /api/users/get-managers/
 */
export async function getManagers(req: Request, res: Response): Promise<void> {
    const managers: Array<TUserLean> = await UserModel.find({ role: ROLES.Manager }, ["-password"]).lean({ virtuals: true });
    res.json({
        success: true,
        message: `${managers.length} manager(s) found.`,
        data: managers
    });
}


// ~ USER 

/**
 * Get the current user.
 * @access Current authenticated user.
 * GET /api/users/current-user/
 */
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
    res.json({
        success: true,
        message: "Here are your details!",
        data: req.user.toObject({ virtuals: true })
    });
}


/**
 * Update the current user.
 * @access Current authenticated user.
 * PATCH /api/users/current-user/
 */
export async function updateCurrentUserDetails(req: Request, res: Response): Promise<void> {
    const { user, body } = req;
    user.set(body);
    const updatedUser: TUser = await user.save();
    res.json({
        success: true,
        message: "Details updated successfully!",
        data: updatedUser.toObject({ virtuals: true })
    });
}


/**
 * Update the current user avatar.
 * @access Current authenticated user.
 * PATCH /api/users/current-user/avatar/
 */
export async function updateCurrentUserAvatar(req: Request, res: Response): Promise<void> {
}


/**
 * Update password.
 * @access Current authenticated user.
 * PATCH /api/users/current-user/password/
 */
export async function updatePassword(req: Request, res: Response): Promise<void> {
    const { oldPassword, newPassword } = req.body as updatePasswordReqBodyType;
    const user: TUser | null = await UserModel.findById(req.user.id);
    if (!user) {
        res.status(404);
        throw new Error("User not found!");
    }
    const isPasswordCorrect: boolean = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        res.status(401);
        throw new Error("Invalid current password!");
    }
    user.set({ password: newPassword });
    await user.save();
    res.json({
        success: true,
        message: "Password updated successfully!"
    });
}


// ~ ADDRESSES 

/**
 * Get all addresses.
 * @access Current authenticated user.
 * Get /api/users/current-user/addresses/
 */
export async function getMyAddresses(req: Request, res: Response): Promise<void> {
    const { user } = req;
    const addresses: TAddressLean[] = user.addresses.map((address: TAddress): TAddressLean => {
        return address.toObject({ virtuals: true }) as unknown as TAddressLean;
    });
    res.json({
        success: true,
        message: `${addresses.length} address${addresses.length === 1 ? "" : "es"} found.`,
        data: addresses
    });
}


/**
 * Add a new address.
 * @access Current authenticated user.
 * POST /api/users/current-user/addresses
 */
export async function addNewAddress(req: Request, res: Response): Promise<void> {
    const { user, body } = req;
    const address: TAddress = new AddressModel(body);
    user.addresses.push(address);
    await user.save();
    res.json({
        success: true,
        message: "Address added successfully!",
    });
}


/**
 * Delete address by id.
 * @access Current authenticated user.
 * DELETE /api/users/current-user/addresses/:addressId
 */
export async function deleteMyAddress(req: Request, res: Response): Promise<void> {
    const { user, params } = req;
    const addressExists: TAddress | undefined = user.addresses.find((address: TAddress): boolean => address.id === params.addressId);
    if (!addressExists) {
        res.status(404);
        throw new Error("Address not found!");
    }
    user.addresses = user.addresses.filter((address): boolean => {
        return address.id !== req.body.id;
    });
    await user.save();
    const addresses: TAddressLean[] = user.addresses.map((address: TAddress): TAddressLean => {
        return address.toObject({ virtuals: true }) as unknown as TAddressLean;
    });
    res.json({
        success: true,
        message: "Address deleted successfully!",
        data: addresses
    });
}


/**
 * Update address by id.
 * @access Any authenticated user.
 * PATCH /api/users/current-user/addresses/:addressId
 */
export async function updateMyAddress(req: Request, res: Response): Promise<void> {
    const { user, params, body } = req;
    const address: TAddress | undefined = user.addresses.find((address): boolean => address.id === params.addressId);
    if (!address) {
        res.status(404);
        throw new Error("Address not found!");
    }
    address.set(body);
    await user.save();
    res.json({
        success: true,
        message: "Address updated successfully.",
        data: address.toObject({ virtuals: true }),
    });
}


// ~ CART 

/**
 * Get user's cart.
 * @access Any authenticated user.
 * GET /api/users/current-user/cart/
 */
export async function getCart(req: Request, res: Response): Promise<void> {
    const { user } = req;
    const cartItems: Array<TCartItemLean> = user.cartItems.map((item): TCartItemLean => item.toObject({ virtuals: true }));
    res.json({
        success: true,
        message: `${cartItems.length} cart item(s) found.`,
        data: cartItems
    });
}


/**
 * Add item to user's cart.
 * @access Any authenticated user.
 * POST /api/users/current-user/cart/
 */
export async function addToCart(req: Request, res: Response): Promise<void> {
    const { user, body } = req;
    const cartItem: TCartItem = new CartItemModel(body);
    user.cartItems.push(cartItem);
    const result: TUser = await user.save();
    res.json({
        success: true,
        message: "Item added to cart.",
        data: result.cartItems.map((item): TCartItemLean => item.toObject({ virtuals: true })),
    });
}


/**
 * Update cart item quantity.
 * @access Any authenticated user.
 * PATCH /api/users/current-user/cart/:cartItemId/
 */
export async function updateCartItemQuantity(req: Request, res: Response): Promise<void> {
    const { user, body, params } = req;
    const cartItem: TCartItem | undefined = user.cartItems.find((item): boolean => item.id === params.cartItemId);
    if (!cartItem) {
        res.status(404);
        throw new Error("Cart item not found.");
    }
    cartItem.set("quantity", body.quantity);
    const result: TUser = await user.save();
    res.json({
        success: true,
        message: "Item quantity updated..",
        data: result.cartItems.map((item): TCartItemLean => item.toObject({ virtuals: true })),
    });
}


/**
 * Remove item from cart.
 * @access Any authenticated user.
 * DELETE /api/users/current-user/cart/:cartItemId/
 */
export async function removeItemFromCart(req: Request, res: Response): Promise<void> {
    const { user, params } = req;
    const cartItems: Array<TCartItem> = user.cartItems.filter((item): boolean => item.id !== params.cartItemId);
    user.set({ cartItems });
    const result: TUser = await user.save();
    res.json({
        success: true,
        message: "Item removed from cart.",
        data: result.cartItems.map((item): TCartItemLean => item.toObject({ virtuals: true })),
    });
}


/**
 * Clear cart.
 * @access Any authenticated user.
 * DELETE /api/users/current-user/cart/
 */
export async function clearCart(req: Request, res: Response): Promise<void> {
    const { user } = req;
    user.set({ cartItems: [] });
    const result: TUser = await user.save();
    res.json({
        success: true,
        message: "Cart cleared successfully.",
        data: result.cartItems.map((item): TCartItemLean => item.toObject({ virtuals: true })),
    });
}