import { Router } from "express";
import { ROLES } from "../constants.js";
import { cancelOrder, createOrder, getAllOrders, getMyOrderById, getOrderById, updateOrderStatus } from "../controllers/order.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { createOrderReqBody } from "../zod/requests/order.zod.js";


export const orderRouter = Router();


orderRouter.route("/")
    .get(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        getAllOrders
    ).post(
        authenticate,
        validateBody(createOrderReqBody),
        createOrder
    );


orderRouter.route("/current-user/:orderId")
    .get(
        authenticate,
        getMyOrderById
    );


orderRouter.route("/:orderId")
    .get(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        getOrderById
    );


orderRouter.route("/:orderId/update")
    .patch(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        validateBody(createOrderReqBody.pick({ status: true })),
        updateOrderStatus
    );


orderRouter.route("/:orderId/cancel")
    .patch(
        authenticate,
        cancelOrder
    );