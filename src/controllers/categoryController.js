import { Category, SubCategory } from "../models/categoryModel.js";

// Utility function for error handling
const handleError = (res, error, message, statusCode = 500) => {
  console.error(error);
  return res
    .status(statusCode)
    .json({ success: false, message, error: error.message || error });
};

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }
    const category = new Category({ name });
    await category.save();
    if (!category) {
      return res
        .status(500)
        .json({ success: false, message: "Category creation failed" });
    }
    res.status(201).json({ success: true, category });
  } catch (error) {
    handleError(res, error, "Failed to create category");
  }
};

export const getCategoryController = async (req, res) => {
  try {
    // Logic to get a category by ID
    const categoryId = req.params.id;
    res.status(200).json({
      message: `Category with ID ${categoryId} retrieved successfully`,
    });
  } catch (error) {
    console.error("Error in getCategoryController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCategoriesController = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    if (categories.length === null) {
      return res
        .status(404)
        .json({ success: false, message: "No categories found" });
    }
    res.status(200).json({ success: true, categories });
  } catch (error) {
    handleError(res, error, "Failed to get category");
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category already exists" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug: slugify(name, { lower: true, strict: true }) },
      { new: true }
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to update category" });
    }
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    handleError(res, error, "Failed to update category");
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const existCategory = await Category.findById(req.params.id);
    if (!existCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const existingSubCategory = await SubCategory.find({
      category: req.params.id,
    });
    if (existingSubCategory.length > 0) {
      // If there are subcategories related to this category, do not allow deletion
      return res.status(400).json({
        success: false,
        message:
          " Can't delete the category. Please delete the related subcategory first ",
      });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete category");
  }
};

export const createSubCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Subcategory name is required" });
    }
    const existingSubCategory = await SubCategory.findOne({
      name,
      category: id,
    });

    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: "Subcategory already exists",
      });
    }
    const subCategory = new SubCategory({
      name,
      category: id,
    });
    await subCategory.save();
    if (!subCategory) {
      return res
        .status(500)
        .json({ success: false, message: "Subcategory creation failed" });
    }
    res.status(201).json({ success: true, subCategory });
  } catch (error) {
    handleError(res, error, "Failed to create subcategory");
  }
};

export const getSubCategoryController = async (req, res) => {
  try {
    // Logic to get a sub-category by ID
    const subCategoryId = req.params.id;
    res.status(200).json({
      message: `Sub-category with ID ${subCategoryId} retrieved successfully`,
    });
  } catch (error) {
    console.error("Error in getSubCategoryController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubCategoriesController = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategories = await SubCategory.find({ category: id })
      .sort({
        createdAt: -1,
      })
      .populate("category", "name");
    if (subCategories.length === null) {
      return res
        .status(404)
        .json({ success: false, message: "No subcategories found" });
    }
    res.status(200).json({ success: true, subCategories });
  } catch (error) {
    handleError(res, error, "Failed to get subcategory");
  }
};

export const updateSubCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId } = req.params;
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Subcategory name is required" });
    }
    const existingSubCategory = await SubCategory.findOne({
      name,
      category: categoryId,
    });
    if (existingSubCategory) {
      return res.status(400).json({
        success: false,
        message: "Subcategory already exists",
      });
    }
    const subCategory = await SubCategory.findByIdAndUpdate(
      id,
      { name, slug: slugify(name, { lower: true, strict: true }) },
      { new: true }
    );
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to update subcategory" });
    }
    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      subCategory,
    });
  } catch (error) {
    handleError(res, error, "Failed to update subcategory");
  }
};

export const deleteSubCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId } = req.params;
    const existSubCategory = await SubCategory.findById(id);
    if (!existSubCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });
    }
    const subCategory = await SubCategory.findByIdAndDelete(id);
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Subcategory not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Subcategory deleted successfully" });
  } catch (error) {
    handleError(res, error, "Failed to delete subcategory");
  }
};
