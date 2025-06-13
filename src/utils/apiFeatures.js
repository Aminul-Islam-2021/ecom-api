// class updatedApiFeatures {
//   constructor(query, queryStr) {
//     this.query = query;
//     this.queryStr = queryStr;
//   }

//   search() {
//     const keyword = this.queryStr.keyword
//       ? {
//           $or: [
//             { title: { $regex: this.queryStr.keyword, $options: "i" } },
//             { brand: { $regex: this.queryStr.keyword, $options: "i" } },
//             { description: { $regex: this.queryStr.keyword, $options: "i" } },
//             { tags: { $regex: this.queryStr.keyword, $options: "i" } },
//           ],
//         }
//       : {};
//     this.query = this.query.find({ ...keyword });
//     return this;
//   }

//   filter() {
//     const queryCopy = { ...this.queryStr };

//     // Remove fields that are not for filtering
//     const removeFields = ["keyword", "page", "limit", "sort", "fields"];
//     removeFields.forEach((key) => delete queryCopy[key]);

//     // Handle price and discount filters
//     let queryStr = JSON.stringify(queryCopy);
//     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

//     // Handle variant filters (color, size)
//     if (queryCopy.variants) {
//       const variantFilters = JSON.parse(queryCopy.variants);
//       delete queryCopy.variants;

//       const variantConditions = [];
//       if (variantFilters.color) {
//         variantConditions.push({ "variants.color": variantFilters.color });
//       }
//       if (variantFilters.size) {
//         variantConditions.push({ "variants.sizes.size": variantFilters.size });
//       }

//       if (variantConditions.length > 0) {
//         this.query = this.query.find({
//           ...JSON.parse(queryStr),
//           $and: variantConditions,
//         });
//         return this;
//       }
//     }

//     this.query = this.query.find(JSON.parse(queryStr));
//     return this;
//   }

//   sort() {
//     if (this.queryStr.sort) {
//       const sortBy = this.queryStr.sort.split(",").join(" ");
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort("-createdAt");
//     }
//     return this;
//   }

//   limitFields() {
//     if (this.queryStr.fields) {
//       const fields = this.queryStr.fields.split(",").join(" ");
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select("-__v");
//     }
//     return this;
//   }

//   paginate() {
//     const page = this.queryStr.page * 1 || 1;
//     const limit = this.queryStr.limit * 1 || 10;
//     const skip = (page - 1) * limit;
//     this.query = this.query.skip(skip).limit(limit);
//     return this;
//   }

//   async getFilterMetadata() {
//     const total = await this.query.model.countDocuments(this.query.getFilter());
//     const aggregation = await this.query.model.aggregate([
//       { $match: this.query.getFilter() },
//       {
//         $facet: {
//           priceRange: [
//             {
//               $group: {
//                 _id: null,
//                 minPrice: { $min: "$discountedPrice" },
//                 maxPrice: { $max: "$discountedPrice" },
//               },
//             },
//           ],
//           colors: [
//             { $unwind: "$variants" },
//             { $group: { _id: "$variants.color", count: { $sum: 1 } } },
//           ],
//           sizes: [
//             { $unwind: "$variants" },
//             { $unwind: "$variants.sizes" },
//             { $group: { _id: "$variants.sizes.size", count: { $sum: 1 } } },
//           ],
//           brands: [{ $group: { _id: "$brand", count: { $sum: 1 } } }],
//           categories: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
//         },
//       },
//     ]);

//     const metadata = {
//       total,
//       priceRange: aggregation[0].priceRange[0] || { minPrice: 0, maxPrice: 0 },
//       colors: aggregation[0].colors,
//       sizes: aggregation[0].sizes,
//       brands: aggregation[0].brands,
//       categories: aggregation[0].categories,
//     };

//     return metadata;
//   }
// }

// export default updatedApiFeatures;





// import mongoose from "mongoose";


// class ApiFeatures {
//   constructor(query, queryStr) {
//     this.query = query;
//     this.queryStr = queryStr;
//   }

//   search() {
//     const keyword = this.queryStr.keyword
//       ? {
//           $or: [
//             { title: { $regex: this.queryStr.keyword, $options: "i" } },
//             { slug: { $regex: this.queryStr.keyword, $options: "i" } },
//             { tags: { $regex: this.queryStr.keyword, $options: "i" } },
//             { brand: { $regex: this.queryStr.keyword, $options: "i" } },
//           ],
//         }
//       : {};
//     this.query = this.query.find({ ...keyword });
//     return this;
//   }

//   filter() {
//     const queryCopy = { ...this.queryStr };
//     const removeFields = ["keyword", "page", "limit", "sort"];
//     removeFields.forEach((field) => delete queryCopy[field]);

//     // Price range filtering
//     if (queryCopy.minPrice || queryCopy.maxPrice) {
//       queryCopy.discountedPrice = {
//         ...(queryCopy.minPrice && { $gte: parseFloat(queryCopy.minPrice) }),
//         ...(queryCopy.maxPrice && { $lte: parseFloat(queryCopy.maxPrice) }),
//       };
//       delete queryCopy.minPrice;
//       delete queryCopy.maxPrice;
//     }

//     // Color filtering
//     if (queryCopy.color) {
//       queryCopy["variants.color"] = queryCopy.color;
//       delete queryCopy.color;
//     }

//     // Size filtering
//     if (queryCopy.size) {
//       queryCopy["variants.sizes.size"] = queryCopy.size;
//       delete queryCopy.size;
//     }

//     // Category and subcategory filtering
//     if (queryCopy.category) {
//       queryCopy.category = new mongoose.Types.ObjectId(queryCopy.category);
//       delete queryCopy.category;
//     }
//     if (queryCopy.subcategory) {
//       queryCopy.subcategory = new mongoose.Types.ObjectId(
//         queryCopy.subcategory
//       );
//       delete queryCopy.subcategory;
//     }

//     // Convert query string to MongoDB query syntax
//     let queryStr = JSON.stringify(queryCopy);
//     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

//     this.query = this.query.find(JSON.parse(queryStr));
//     return this;
//   }

//   sort() {
//     if (this.queryStr.sort) {
//       let sortBy;
//       switch(this.queryStr.sort) {
//         case 'price_asc':
//           sortBy = { discountedPrice: 1 };
//           break;
//         case 'price_desc':
//           sortBy = { discountedPrice: -1 };
//           break;
//         case 'newest':
//           sortBy = { createdAt: -1 };
//           break;
//         case 'rating':
//           sortBy = { ratings: -1 };
//           break;
//         default:
//           sortBy = { createdAt: -1 };
//       }
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort("-createdAt");
//     }
//     return this;
//   }

//   paginate() {
//     const page = parseInt(this.queryStr.page, 10) || 1;
//     const limit = parseInt(this.queryStr.limit, 10) || 10;
//     const skip = (page - 1) * limit;

//     this.query = this.query.skip(skip).limit(limit);
//     return this;
//   }

//   async getTotalCount() {
//     const totalQuery = this.query.model.find(this.query.getFilter());
//     return await totalQuery.countDocuments();
//   }
// }

// export default ApiFeatures;





class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query; // MongoDB query
    this.queryStr = queryStr; // Query string from the request (req.query)
  }

  // Search by title or slug
  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            { title: { $regex: this.queryStr.keyword, $options: "i" } },
            { slug: { $regex: this.queryStr.keyword, $options: "i" } },
            { tags: { $regex: this.queryStr.keyword, $options: "i" } },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Filter by category, subcategory, price range, color, etc.
  filter() {
    const queryCopy = { ...this.queryStr };

    // Remove fields that are not for filtering
    const removeFields = ["keyword", "page", "limit", "sort"];
    removeFields.forEach((field) => delete queryCopy[field]);

    // Remove fields with empty values
    for (const key in queryCopy) {
      if (queryCopy[key] === "" || queryCopy[key] === null || queryCopy[key] === undefined) {
        delete queryCopy[key];
      }
    }

    // Filter by price range
    if (queryCopy.price) {
      const priceRange = queryCopy.price.split("-");
      queryCopy.price = {
        $gte: parseFloat(priceRange[0]),
        $lte: parseFloat(priceRange[1]),
      };
    }

    // Filter by color (assuming variants contain a color field)
    if (queryCopy.color) {
      queryCopy["variants.color"] = queryCopy.color;
      delete queryCopy.color;
    }

    // Convert query string to MongoDB query syntax
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Sort results
  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // Default sorting by latest
    }
    return this;
  }

  // Pagination
  paginate() {
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  // Get total count of documents (for pagination)
  async getTotalCount() {
    const totalQuery = this.query.model.find(this.query.getFilter());
    return await totalQuery.countDocuments();
  }
}

export default ApiFeatures;
