import express from "express";
import {
  createCategoryController,
  createSubCategoryController,
  deleteCategoryController,
  deleteSubCategoryController,
  getCategoriesController,
  getCategoryController,
  getSubCategoriesController,
  getSubCategoryController,
  updateCategoryController,
  updateSubCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

// Category Routes
router.route("/").post(createCategoryController).get(getCategoriesController);

router
  .route("/:id")
  .get(getCategoryController)
  .put(updateCategoryController)
  .delete(deleteCategoryController);

// SubCategory Routes
router
  .route("/:categoryId/subcategory")
  .post(createSubCategoryController)
  .get(getSubCategoriesController);

router
  .route("/:categoryId/subcategory/:id")
  .get(getSubCategoryController)
  .put(updateSubCategoryController)
  .delete(deleteSubCategoryController);

export default router;
