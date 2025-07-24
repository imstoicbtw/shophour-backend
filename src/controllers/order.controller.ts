import { Request, Response } from "express";
import { OrderModel, TOrder, TOrderLean } from "../models/order.model.js";
import { OrderItemModel, TOrderItem } from "../models/subdocs/order-item.model.js";
import { createOrderReqBodyType } from "../zod/requests/order.zod.js";

/**
 * Get all orders.
 * @access [admin, manager]
 * GET /api/orders/
 */
export async function getAllOrders(req: Request, res: Response): Promise<void> {
    const orders: Array<TOrder> = await OrderModel.find();
    res.json({
        success: true,
        message: `${orders.length} order(s) found.`,
        data: orders.map((item): TOrderLean => item.toObject({ virtuals: true })),
    });
}


/**
 * Create a new order.
 * @access Any authenticated user.
 * POST /api/orders/
 */
export async function createOrder(req: Request, res: Response): Promise<void> {
    const { body }: { body: createOrderReqBodyType } = req;
    const { user } = req;
    const products: Array<TOrderItem> = body.products.map((item): TOrderItem => new OrderItemModel(item));
    const order: TOrder = new OrderModel({ ...body, products, user: user.id });
    const result = await order.save();
    res.json({
        success: true,
        message: "Order created successfully.",
        data: order.toObject({ virtuals: true }),
    });
}


/**
 * Get all orders of the current user.
 * @access Any authenticated user.
 * GET /api/orders/current-user/
 */
export async function getMyOrders(req: Request, res: Response): Promise<void> {
    const { user } = req;
    const orders: Array<TOrder> = await OrderModel.find({ user: user.id });
    res.json({
        success: true,
        message: `${orders.length} order(s) found.`,
        data: orders.map((item): TOrderLean => item.toObject({ virtuals: true })),
    });
}


/**
 * Get order of the current user by id.
 * @access Any authenticated user.
 * GET /api/orders/current-user/:orderId/
 */
export async function getMyOrderById(req: Request, res: Response): Promise<void> {
    const { user, params } = req;
    const order: TOrder | null = await OrderModel.findById(params.orderId);
    if (!order) {
        res.status(404);
        throw new Error("Order not found.");
    } else if (order.user.toString() !== user.id) {
        res.status(401);
        throw new Error("You are not allowed to access this order.");
    }
    res.json({
        success: true,
        message: "Order fetched successfully.",
        data: order.toObject({ virtuals: true }),
    });

}


/**
 * Get order by id.
 * @access Any authenticated user.
 * GET /api/orders/:orderId/
 */
export async function getOrderById(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const order: TOrder | null = await OrderModel.findById(orderId);
    if (!order) {
        res.status(404);
        throw new Error("Order not found.");
    }
    res.json({
        success: true,
        message: "Order fetched successfully.",
        data: order.toObject({ virtuals: true }),
    });
}


/**
 * Update order status.
 * @access [admin, manager]
 * PATCH /api/orders/:orderId/update/
 */
export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const { status }: Pick<createOrderReqBodyType, "status"> = req.body;
    const order: TOrder | null = await OrderModel.findById(orderId);
    if (!order) {
        res.status(404);
        throw new Error("Order not found.");
    }
    order.set("status", status);
    const result: TOrder = await order.save();
    res.json({
        success: true,
        message: "Order status updated successfully.",
        data: order.toObject({ virtuals: true }),
    });
}


/**
 * Cancel order.
 * @access Any authenticated user.
 * PATCH /api/orders/:orderId/cancel/
 */
// TODO: Implement cancellation policy.
export async function cancelOrder(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const order: TOrder | null = await OrderModel.findById(orderId);
    if (!order) {
        res.status(404);
        throw new Error("Order not found.");
    }
    order.set("status", "cancelled");
    const result: TOrder = await order.save();
    res.json({
        success: true,
        message: "Order cancelled successfully.",
        data: result.toObject({ virtuals: true }),
    });
}