import { Request, Response } from 'express';
import { ROLES } from "../constants.js";
import AddressModel, { TAddress, TAddressLean } from "../models/subdocs/address.model.js";
import UserModel, { TUser, TUserLean } from "../models/user.model.js";


/**
 * Get all customers.
 * @access [ admin, manager ]
 * GET /api/users/get-customers/
 */
export async function getCustomers(req: Request, res: Response): Promise<void> {
    const customers: Array<TUserLean> = await UserModel.find({ role: ROLES.Customer }, ["-password"]).lean({ virtuals: true });
    res.json({
        success: true,
        message: `${customers.length} customer${customers.length === 1 ? "" : "s"} found.`,
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
        message: `${managers.length} manager${managers.length === 1 ? "" : "s"} found.`,
        data: managers
    });
}


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
    const { name, email } = body;
    user.set({
        name: {
            firstName: name?.firstName || user.name.firstName,
            lastName: name?.lastName || user.name.lastName
        },
        email: email || user.email
    });
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
    const { oldPassword, newPassword } = req.body;
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
    const addresses: TAddressLean[] = user.addresses.map((address: TAddress): TAddressLean => {
        return address.toObject({ virtuals: true }) as unknown as TAddressLean;
    });
    res.json({
        success: true,
        message: "Address added successfully!",
        data: addresses
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
    user.addresses = user.addresses.filter((address: TAddress): boolean => {
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