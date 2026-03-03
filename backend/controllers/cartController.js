const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

async function computeCartTotal() {
  const items = await Cart.find({});
  return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
}

exports.getCart = async (_req, res) => {
  try {
    const items = await Cart.find({}).sort({ createdAt: -1 }).populate("productId");
    const cartTotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    return res.json({ success: true, data: { items, cartTotal } });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: error?.message || error,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body || {};
    const qty = Math.max(parseInt(quantity || "1", 10), 1);

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const existing = await Cart.findOne({ productId });
    const newQty = (existing?.quantity || 0) + qty;
    const totalPrice = newQty * product.price;

    const saved = await Cart.findOneAndUpdate(
      { productId },
      { productId, quantity: newQty, totalPrice },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate("productId");

    const cartTotal = await computeCartTotal();

    return res.status(existing ? 200 : 201).json({
      success: true,
      data: { item: saved, cartTotal },
    });
  } catch (error) {
    const isDuplicateKey = error?.code === 11000;
    return res.status(isDuplicateKey ? 409 : 500).json({
      success: false,
      message: isDuplicateKey ? "Cart item already exists" : "Failed to add to cart",
      error: error?.message || error,
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid cart item id" });
    }
    if (action !== "inc" && action !== "dec") {
      return res.status(400).json({ success: false, message: "action must be 'inc' or 'dec'" });
    }

    const item = await Cart.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      await Cart.findByIdAndDelete(id);
      return res.status(404).json({ success: false, message: "Product no longer exists" });
    }

    const nextQty = action === "inc" ? item.quantity + 1 : item.quantity - 1;
    if (nextQty <= 0) {
      await Cart.findByIdAndDelete(id);
      const cartTotal = await computeCartTotal();
      return res.json({ success: true, data: { item: null, cartTotal } });
    }

    item.quantity = nextQty;
    item.totalPrice = nextQty * product.price;
    await item.save();

    const populated = await Cart.findById(id).populate("productId");
    const cartTotal = await computeCartTotal();

    return res.json({ success: true, data: { item: populated, cartTotal } });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error?.message || error,
    });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid cart item id" });
    }

    const deleted = await Cart.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    const cartTotal = await computeCartTotal();
    return res.json({ success: true, data: { id, cartTotal } });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
      error: error?.message || error,
    });
  }
};

