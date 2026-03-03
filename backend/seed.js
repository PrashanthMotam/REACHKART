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
    image: "https://picsum.photos/seed/headphones/500/350",
  },
  {
    name: "Smart Watch",
    description: "Track steps, heart rate, and notifications.",
    price: 3999,
    category: "Electronics",
    stock: 18,
    image: "https://picsum.photos/seed/smartwatch/500/350",
  },
  {
    name: "Running Shoes",
    description: "Lightweight shoes for daily training.",
    price: 2799,
    category: "Fashion",
    stock: 40,
    image: "https://picsum.photos/seed/shoes/500/350",
  },
  {
    name: "Backpack",
    description: "Laptop-friendly backpack with water resistance.",
    price: 1499,
    category: "Fashion",
    stock: 35,
    image: "https://picsum.photos/seed/backpack/500/350",
  },
  {
    name: "Coffee Mug",
    description: "Ceramic mug for hot and cold drinks.",
    price: 299,
    category: "Home",
    stock: 80,
    image: "https://picsum.photos/seed/mug/500/350",
  },
  {
    name: "Desk Lamp",
    description: "LED lamp with adjustable brightness.",
    price: 899,
    category: "Home",
    stock: 30,
    image: "https://picsum.photos/seed/lamp/500/350",
  },
  {
    name: "Notebook",
    description: "A5 notebook with 200 pages.",
    price: 199,
    category: "Stationery",
    stock: 120,
    image: "https://picsum.photos/seed/notebook/500/350",
  },
  {
    name: "Gaming Mouse",
    description: "High-precision sensor with RGB lighting.",
    price: 1299,
    category: "Electronics",
    stock: 22,
    image: "https://picsum.photos/seed/mouse/500/350",
  },
  {
    name: "Water Bottle",
    description: "BPA-free bottle, 1 liter capacity.",
    price: 499,
    category: "Sports",
    stock: 60,
    image: "https://picsum.photos/seed/bottle/500/350",
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable speaker with punchy sound.",
    price: 1899,
    category: "Electronics",
    stock: 16,
    image: "https://picsum.photos/seed/speaker/500/350",
  },
  // Extra products to make 20 total, with related imagery
  {
    name: "Wireless Earbuds",
    description: "Compact earbuds with noise isolation.",
    price: 2199,
    category: "Electronics",
    stock: 30,
    image: "https://picsum.photos/seed/earbuds/500/350",
  },
  {
    name: "Laptop Stand",
    description: "Aluminum stand for ergonomic setup.",
    price: 1599,
    category: "Electronics",
    stock: 20,
    image: "https://picsum.photos/seed/laptopstand/500/350",
  },
  {
    name: "Wireless Keyboard",
    description: "Slim wireless keyboard for desktop and laptop.",
    price: 1799,
    category: "Electronics",
    stock: 26,
    image: "https://picsum.photos/seed/keyboard/500/350",
  },
  {
    name: "Office Chair",
    description: "Ergonomic chair with lumbar support.",
    price: 5499,
    category: "Home",
    stock: 12,
    image: "https://picsum.photos/seed/officechair/500/350",
  },
  {
    name: "Travel Duffel Bag",
    description: "Spacious duffel bag for weekend trips.",
    price: 1899,
    category: "Fashion",
    stock: 28,
    image: "https://picsum.photos/seed/duffel/500/350",
  },
  {
    name: "Sports T-Shirt",
    description: "Quick-dry t-shirt for workouts.",
    price: 599,
    category: "Fashion",
    stock: 70,
    image: "https://picsum.photos/seed/tshirt/500/350",
  },
  {
    name: "Yoga Mat",
    description: "Non-slip mat ideal for yoga and stretching.",
    price: 999,
    category: "Sports",
    stock: 34,
    image: "https://picsum.photos/seed/yogamat/500/350",
  },
  {
    name: "Wall Clock",
    description: "Minimal wall clock for home or office.",
    price: 799,
    category: "Home",
    stock: 24,
    image: "https://picsum.photos/seed/clock/500/350",
  },
  {
    name: "Scented Candle",
    description: "Relaxing aroma candle for evenings.",
    price: 399,
    category: "Home",
    stock: 50,
    image: "https://picsum.photos/seed/candle/500/350",
  },
  {
    name: "Desk Organizer",
    description: "Keep your stationery neatly arranged.",
    price: 499,
    category: "Stationery",
    stock: 65,
    image: "https://picsum.photos/seed/organizer/500/350",
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

