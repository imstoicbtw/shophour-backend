import { Request, Response } from "express";
import { ROLES } from "../constants.js";
import ProductModel, { TProduct, TProductLean } from "../models/product.model.js";
import { ProductReviewModel, TProductReview } from "../models/subdocs/product-review.model.js";


/**
 * Create a new product.
 * ACCESS [admin, manager]
 * POST /api/products/
 */
export async function createProduct(req: Request, res: Response): Promise<void> {
    const { body } = req;
    const product: TProduct = new ProductModel(body);
    await product.save();
    res.json({
        success: true,
        message: "Product created successfully.",
        data: product.toObject({ virtuals: true }),
    });
}


/**
 * Delete a product.
 * ACCESS [admin, manager]
 * DELETE /api/products/:productId
 */
export async function deleteProduct(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;
    const { deletedCount } = await ProductModel.deleteOne({ _id: productId });
    if (!deletedCount) {
        throw new Error("Failed to delete product.");
    }
    res.json({
        success: true,
        message: "Product deleted successfully.",
    });
}


/**
 * Get many products.
 * ACCESS OPEN
 * GET /api/products
 */
export async function getProducts(_req: Request, res: Response): Promise<void> {
    const products: TProduct[] = await ProductModel.find();
    res.json({
        success: true,
        message: `${products.length} product${products.length === 1 ? "" : "s"} found.`,
        data: products,
    });
}


/**
 * Get product by id.
 * ACCESS OPEN
 * GET /api/products/:productId
 */
export async function getProductById(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;
    const product: TProductLean | null = await ProductModel.findById(productId).lean({ virtuals: true }) as unknown as TProductLean;
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }
    res.json({
        success: true,
        data: product,
    });
}


/**
 * Update a product
 * ACCESS [admin, manager]
 * PUT /api/products/:productId
 */
export async function updateProduct(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;
    const { body } = req;
    const product: TProduct | null = await ProductModel.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }
    product.set(body);
    await product.save();
    res.json({
        success: true,
        message: "Product updated successfully",
        data: product.toObject({ virtuals: true }),
    })
}


/**
 * Patch a single property of a product.
 * ACCESS [admin, manager]
 * PATCH /api/products/:productId
 */
export async function updateProductProperty(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;
    const { key, value } = req.body;
    const product: TProduct | null = await ProductModel.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }
    product.set(key, value);
    await product.save();
    res.json({
        success: true,
        message: "Product updated successfully",
        data: product.toObject({ virtuals: true }),
    });
}


/**
 * Get all reviews of a product.
 * ACCESS OPEN
 * GET /api/products/:productId/reviews/
 */
export async function getProductReviews(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;
    const product: Pick<TProduct, "reviews"> | null = await ProductModel.findById(productId, ["reviews"]);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }
    res.json({
        success: true,
        data: product.reviews,
    })
        ;
}


/**
 * Add a new product review.
 * ACCESS User who got delivered an order containing that product.
 * POST /api/products/:productId/reviews/
 */
// todo Only user who got delivered an order containing the product can submit a review.
export async function submitReview(req: Request, res: Response): Promise<void> {
    const { body } = req;
    const { productId } = req.params;
    const product: TProduct | null = await ProductModel.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }
    const review: TProductReview = new ProductReviewModel(body);
    product.reviews.push(review);
    await product.save();
    res.json({
        success: true,
        message: "Review submitted successfully.",
        data: review.toObject({ virtuals: true }),
    });
}


/**
 * Delete a review.
 * ACCESS [admin, manager, review owner]
 * DELETE /api/products/:productId/reviews/:reviewId/
 */
export async function deleteReview(req: Request, res: Response): Promise<void> {
    const { productId, reviewId } = req.params;
    const { user } = req;
    const product: Pick<TProduct, "reviews"> | null = await ProductModel.findById(productId, ["reviews"]);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }
    const review: TProductReview | undefined = product.reviews.find((document: TProductReview): boolean => {
        return document.id === reviewId;
    });
    if (!review) {
        res.status(404);
        throw new Error("Review not found.");
    }
    const isOwner: boolean = review.user.toString() === user.id;
    if (!isOwner || !([ROLES.Admin, ROLES.Manager].includes(user.role))) {
        res.status(401);
        throw new Error("Unauthorized.");
    }
    product.reviews = product.reviews.filter((review): boolean => review.id !== reviewId);
}


/**
 * Edit a review.
 * ACCESS The review owner.
 * PATCH /api/products/:productId/reviews/:reviewId/
 */
export async function editReview(req: Request, res: Response): Promise<void> {
    const { productId, reviewId } = req.params;
    const { user, body } = req;
    const product: TProduct | null = await ProductModel.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error("Product not found.");
    }
    const review: TProductReview | undefined = product.reviews.find((review: TProductReview): boolean => {
        return review.id === reviewId;
    });
    if (!review) {
        res.status(404);
        throw new Error("Review not found.");
    } else if (review.user.toString() !== user.id) {
        res.status(401);
        throw new Error("You're not allowed to edit this review.");
    }
    delete body.user;
    review.set(body);
    await product.save();
    res.json({
        success: true,
        message: "Review updated successfully.",
        data: review.toObject({ virtuals: true }),
    });
}