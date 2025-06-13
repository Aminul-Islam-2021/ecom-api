import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      lowercase: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name must be at most 50 characters"],
    },
    slug: { type: String, unique: true, lowercase: true },
  },
  { timestamps: true }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      unique: true,
      lowercase: true,
      minlength: [2, "Subcategory name must be at least 2 characters"],
      maxlength: [50, "Subcategory name must be at most 50 characters"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must belong to a category"],
    },
    slug: { type: String, unique: true, lowercase: true },
  },
  { timestamps: true }
);

subCategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
export const Category = mongoose.model("Category", categorySchema);
export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
