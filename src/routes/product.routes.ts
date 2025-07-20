import {Router} from "express";
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
} from "../controllers/product.controllers.js";
import {authenticate, authorize} from "../middlewares/auth.middleware.js";
import {ROLES} from "../constants.js";


export const productRouter: Router = Router();

productRouter.route("/")
    .get(getProducts)
    .post(authenticate, authorize(ROLES.Admin, ROLES.Manager), createProduct)

productRouter.route("/:productId")
    .get(getProductById)
    .put(authenticate, authorize(ROLES.Admin, ROLES.Manager), updateProduct)
    .delete(authenticate, authorize(ROLES.Admin, ROLES.Manager), deleteProduct)
    .patch(authenticate, authorize(ROLES.Admin, ROLES.Manager), updateProductProperty)


// Reviews

productRouter.route("/:productId/reviews/")
    .get(getProductReviews)
    .post(authenticate, submitReview)


productRouter.route("/:productId/reviews/:reviewId")
    .delete(authenticate, authorize(ROLES.Admin, ROLES.Manager), deleteReview)
    .patch(authenticate, editReview)