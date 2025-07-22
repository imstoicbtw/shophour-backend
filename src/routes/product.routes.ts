import { Router } from "express";
import { ROLES } from "../constants.js";
import {
    createProduct,
    deleteProduct,
    deleteReview,
    editReview,
    getProductById,
    getProductReviews,
    getProducts,
    submitReview,
    updateProduct,
    updateProductProperty
} from "../controllers/product.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { createProductReqBody, updateProductPropertyReqBody } from "../zod/requests/product.zod.js";


export const productRouter: Router = Router();

productRouter.route("/")
    .get(getProducts)
    .post(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        validateBody(createProductReqBody),
        createProduct
    );

productRouter.route("/:productId")
    .get(getProductById)
    .put(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        validateBody(createProductReqBody.partial()),
        updateProduct
    )
    .delete(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        deleteProduct
    )
    .patch(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        validateBody(updateProductPropertyReqBody),
        updateProductProperty
    )


// Reviews

productRouter.route("/:productId/reviews/")
    .get(getProductReviews)
    .post(
        authenticate,
        submitReview
    )


productRouter.route("/:productId/reviews/:reviewId")
    .delete(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        deleteReview
    )
    .patch(
        authenticate,
        editReview
    )