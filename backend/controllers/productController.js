const mongoose = require("mongoose");
const Product = require("../models/Product");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body || {};

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "name and price are required",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image,
    });

    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error?.message || error,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (typeof search === "string" && search.trim()) {
      filter.name = { $regex: escapeRegExp(search.trim()), $options: "i" };
    }

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error?.message || error,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid product id" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error?.message || error,
    });
  }
};
