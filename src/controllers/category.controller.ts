import { Request, Response } from "express";
import { CategoryModel, TCategory, TCategoryLean } from "../models/category.model.js";
import { ProductModel, TProduct } from "../models/product.model.js";

/**
 * Get all categories.
 * @access OPEN
 * GET /api/categories/ 
 */
export async function getAllCategories(req: Request, res: Response): Promise<void> {
    const categories: Array<TCategoryLean> = await CategoryModel.find().lean({ virtuals: true });
    res.json({
        success: true,
        message: `${categories.length} product(s) found.`,
        data: categories,
    });
}


/**
 * Get category by id.
 * @access OPEN
 * GET /api/categories/:categoryId/
 */
export async function getCategoryById(req: Request, res: Response): Promise<void> {
    const { categoryId } = req.params;
    const category: TCategory | null = await CategoryModel.findById(categoryId);
    if (!category) {
        res.status(404);
        throw new Error("Category not found!");
    }
    res.json({
        success: true,
        message: `${category.name} category found.`,
        data: category.toObject({ virtuals: true }),
    });
}


/**
 * Create a new category.
 * @access [admin, manager]
 * POST /api/categories/
 */
export async function createCategory(req: Request, res: Response): Promise<void> {
    const { body } = req;
    const category: TCategory = new CategoryModel(body);
    const result: TCategory = await category.save();
    if (!result.id) throw new Error("Unable to create a new category.");
    res.json({
        success: true,
        message: "New category created successfully.",
        data: { ...result },
    });
}


/**
 * Update a category.
 * @access [admin, manager]
 * PATCH /api/categories/:categoryId/
 */
export async function updateCategory(req: Request, res: Response): Promise<void> {
    const { body, params } = req;
    const category: TCategory | null = await CategoryModel.findById(params.categoryId);
    if (!category) {
        res.status(404);
        throw new Error("Category not found!");
    }
    category.set(body);
    const result: TCategory = await category.save();
    if (!category.id) throw new Error("Unable to update category.");
    res.json({
        success: true,
        message: "Category updated successfully.",
        data: result.toObject({ virtuals: true }),
    });
}


/**
 * Delete a category.
 * @access [admin, manager]
 * DELETE /api/categories/:categoryId/
 */
export async function deleteCategory(req: Request, res: Response): Promise<void> {
    const { categoryId } = req.params;
    const category: TCategory | null = await CategoryModel.findByIdAndDelete(categoryId);
    if (!category) {
        res.status(404);
        throw new Error("Category not found!");
    }
    res.json({
        success: true,
        message: "Category deleted successfully.",
    });
}


/**
 * Get products in a category.
 * @access OPEN
 * GET /api/categories/:categoryId/products/
 */
export async function getCategoryProducts(req: Request, res: Response): Promise<void> {
    const { categoryId } = req.params;
    const products: Array<TProduct> = await ProductModel.find({ category: categoryId });
    res.json({
        success: true,
        message: `${products.length} product(s) found.`,
        data: products,
    });
}