import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getProductsBySubCategoryId,
  getProductsController,
  updateProductController,
} from "../controllers/productController.js";



import { upload, uploadFields } from "../config/multerConfig.js";

const router = express.Router();

router
  .route("/")
  .post(upload.fields(uploadFields), createProductController)
  .get(getProductsController);

router
  .route("/:id")
  .get(getProductController)
  .put(upload.fields(uploadFields), updateProductController)
  .delete(deleteProductController);

router.route("/:subcategoryId").get(getProductsBySubCategoryId);

export default router;
