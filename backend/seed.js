require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Product = require("./models/Product");
const Cart = require("./models/Cart");

const products = [
  {
    name: "Wireless Headphones",
    description: "Comfort fit, deep bass, long battery life.",
    price: 2499,
    category: "Electronics",
    stock: 25,
    image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
  },
  {
    name: "Smart Watch",
    description: "Track steps, heart rate, and notifications.",
    price: 3999,
    category: "Electronics",
    stock: 18,
    image: "https://m.media-amazon.com/images/I/61hK5QTdINL._AC_SX416_CB1169409_QL70_.jpg",
  },
  {
    name: "Running Shoes",
    description: "Lightweight shoes for daily training.",
    price: 2799,
    category: "Fashion",
    stock: 40,
    image: "https://m.media-amazon.com/images/I/81fWuhUAYSL._SX695_.jpg",
  },
  {
    name: "Backpack",
    description: "Laptop-friendly backpack with water resistance.",
    price: 1499,
    category: "Fashion",
    stock: 35,
    image: "https://m.media-amazon.com/images/I/314pgmgrk0L._AC_SR250,250_QL65_.jpg",
  },
  {
    name: "Coffee Mug",
    description: "Ceramic mug for hot and cold drinks.",
    price: 299,
    category: "Home",
    stock: 80,
    image: "https://m.media-amazon.com/images/I/61qkm65hJOL._AC_UL480_FMwebp_QL65_.jpg",
  },
  {
    name: "Desk Lamp",
    description: "LED lamp with adjustable brightness.",
    price: 899,
    category: "Home",
    stock: 30,
    image: "https://m.media-amazon.com/images/I/61dcESC7EoL._AC_CR0%2C0%2C0%2C0_SX615_SY462_.jpg",
  },
  {
    name: "Notebook",
    description: "A5 notebook with 200 pages.",
    price: 199,
    category: "Stationery",
    stock: 120,
    image: "https://m.media-amazon.com/images/I/712QbGZjjnL._AC_UL480_FMwebp_QL65_.jpg",
  },
  {
    name: "Gaming Mouse",
    description: "High-precision sensor with RGB lighting.",
    price: 1299,
    category: "Electronics",
    stock: 22,
    image: "https://m.media-amazon.com/images/I/516wLo4+lhL._AC_UY327_FMwebp_QL65_.jpg",
  },
  {
    name: "Water Bottle",
    description: "BPA-free bottle, 1 liter capacity.",
    price: 499,
    category: "Sports",
    stock: 60,
    image: "https://m.media-amazon.com/images/I/51YhO8-3DuL._AC_SX416_CB1169409_QL70_.jpg",
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable speaker with punchy sound.",
    price: 1899,
    category: "Electronics",
    stock: 16,
    image: "https://m.media-amazon.com/images/I/71tNG4gr2ML._AC_SX416_CB1169409_QL70_.jpg",
  },
  // Extra products to make 20 total, with related imagery
  {
    name: "Wireless Earbuds",
    description: "Compact earbuds with noise isolation.",
    price: 2199,
    category: "Electronics",
    stock: 30,
    image: "https://m.media-amazon.com/images/I/61ds95t85yL._AC_SX416_CB1169409_QL70_.jpg",
  },
  {
    name: "Laptop Stand",
    description: "Aluminum stand for ergonomic setup.",
    price: 1599,
    category: "Electronics",
    stock: 20,
    image: "https://m.media-amazon.com/images/I/61AS07l2cBL._AC_UY327_FMwebp_QL65_.jpg",
  },
  {
    name: "Wireless Keyboard",
    description: "Slim wireless keyboard for desktop and laptop.",
    price: 1799,
    category: "Electronics",
    stock: 26,
    image: "https://m.media-amazon.com/images/I/61Bcwky45uL._AC_SX416_CB1169409_QL70_.jpg",
  },
  {
    name: "Office Chair",
    description: "Ergonomic chair with lumbar support.",
    price: 5499,
    category: "Home",
    stock: 12,
    image: "https://m.media-amazon.com/images/I/412cI6o9liL._AC_SR250,250_QL65_.jpg",
  },
  {
    name: "Travel Duffel Bag",
    description: "Spacious duffel bag for weekend trips.",
    price: 1899,
    category: "Fashion",
    stock: 28,
    image: "https://m.media-amazon.com/images/I/71G34I5e-+L._AC_SX416_CB1169409_QL70_.jpg",
  },
  {
    name: "Sports T-Shirt",
    description: "Quick-dry t-shirt for workouts.",
    price: 599,
    category: "Fashion",
    stock: 70,
    image: "https://m.media-amazon.com/images/I/615krMsKOOL._AC_SX416_CB1169409_QL70_.jpg",
  },
  {
    name: "Yoga Mat",
    description: "Non-slip mat ideal for yoga and stretching.",
    price: 999,
    category: "Sports",
    stock: 34,
    image: "https://m.media-amazon.com/images/I/71GT6DxGXkL._AC_UL480_FMwebp_QL65_.jpg",
  },
  {
    name: "Wall Clock",
    description: "Minimal wall clock for home or office.",
    price: 799,
    category: "Home",
    stock: 24,
    image: "https://m.media-amazon.com/images/I/41tJTixGF3L._AC_SR250,250_QL65_.jpg",
  },
  {
    name: "Scented Candle",
    description: "Relaxing aroma candle for evenings.",
    price: 399,
    category: "Home",
    stock: 50,
    image: "https://www.bathandbodyworks.in/on/demandware.static/-/Sites-bathandbody_storefront_catalog/default/dw533ea85a/allcandle.jpg"
  },
  {
    name: "Desk Organizer",
    description: "Keep your stationery neatly arranged.",
    price: 499,
    category: "Stationery",
    stock: 65,
    image: "https://m.media-amazon.com/images/I/61Tn4BUGs2L._AC_SX416_CB1169409_QL70_.jpg",
  },
];

async function seed() {
  try {
    await connectDB();

    await Promise.all([Product.deleteMany({}), Cart.deleteMany({})]);
    const inserted = await Product.insertMany(products);

    // eslint-disable-next-line no-console
    console.log(`Seeded ${inserted.length} products`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err?.message || err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();

