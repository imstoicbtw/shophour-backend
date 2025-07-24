import { Router } from "express";
import { ROLES } from "../constants.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, getCategoryProducts, updateCategory } from "../controllers/category.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate-body.middleware.js";
import { createCategoryReqBody } from "../zod/requests/category.zod.js";


export const categoryRouter = Router();


categoryRouter.route("/")
    .get(getAllCategories)
    .post(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        validateBody(createCategoryReqBody),
        createCategory
    );

categoryRouter.route("/:categoryId")
    .get(getCategoryById)
    .patch(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        validateBody(createCategoryReqBody.partial()),
        updateCategory
    )
    .delete(
        authenticate,
        authorize(ROLES.Admin, ROLES.Manager),
        deleteCategory
    );

categoryRouter.route("/:categoryId/products/")
    .get(getCategoryProducts);