import mongoose from "mongoose";
const { Schema } = mongoose;

const singgleProduct = Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const ordertSchema = new Schema({
  total: {
    type: Number,
    required: [true, "Total harus diisi"],
  },
  status: {
    type: String,
    enum: ["pending", "success", "cancelled"],
  },
  name: {
    type: String,
    required: [true, "Nama harus diisi"],
  },
  phone: {
    type: String,
    required: [true, "Nomor Hp harus diisi"],
  },
  email: {
    type: String,
    required: [true, "email harus diisi"],
  },

  //   untuk detail
  itemDetails: [singgleProduct],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Order = mongoose.model("Order", ordertSchema);

export default Order;
