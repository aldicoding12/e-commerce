import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama product harus diisi"],
  },
  price: {
    type: Number,
    required: [true, "Harga produc harus diisi"],
  },
  description: {
    type: String,
    required: [true, "Description product harus diisi"],
  },
  image: {
    type: String,
    default: null, // Perbaikan typo "default"
  },
  category: {
    type: String,
    required: [true, "Category product harus diisi"],
    enum: ["Sepatu", "Baju", "Celana", "Kameja"],
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
