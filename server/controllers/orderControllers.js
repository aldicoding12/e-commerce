import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModels.js";
import Order from "../models/orderModels.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { name, phone, email, cartItem } = req.body;

  if (!cartItem || cartItem.length < 1) {
    return res.status(400).json({
      success: "keranjang masih kosong",
    });
  }

  let orderIten = [];
  let total = 0;

  for (const cart of cartItem) {
    const productData = await Product.findOne({ _id: cart.product });
    if (!productData) {
      return res.status(404).json({ success: "Produk tidak ditemukan" });
    }
    const { name, price, _id } = productData;
    const singgleOrder = {
      name,
      price,
      quantity: cart.quantity,
      product: _id,
    };
    orderIten = [...orderIten, singgleOrder];
    total += cart.quantity * price;
  }
  const order = await Order.create({
    name,
    phone,
    email,
    total,
    itemDetails: orderIten,
    user: req.user.id,
  });
  return res.status(201).json({
    message: "Berhasil membuar orderan",
    total,
    order,
  });
});

export const AllOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  return res.status(200).json({
    message: "Berhasil menampilkan semua orderan",
    data: orders,
  });
});

export const DetailsOrder = asyncHandler(async (req, res) => {
  const detailOrder = await Order.findById(req.params.id);
  return res.status(200).json({
    message: "Berhasil menampilkan detail orderan",
    data: detailOrder,
  });
});

export const CurrentUserOrder = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user.id });
  if (order < 1) {
    return res.json({
      message: "Anda belum memiliki orderan",
    });
  }
  return res.status(200).json({
    message: "Berhasil menampilkan curent user order",
    data: order,
  });
});
