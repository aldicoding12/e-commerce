import mongoose from "mongoose";
const { Schema } = mongoose;
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama harus diisi"],
    unique: true, // Tidak perlu pesan kustom di sini
  },
  email: {
    type: String,
    required: [true, "Email harus diisi"],
    unique: true, // Properti unique tetap seperti ini
    validate: {
      validator: validator.isEmail,
      message: "Email yang kamu input bukan format email",
    },
  },
  password: {
    type: String,
    required: [true, "Password harus diisi"],
    minLength: [6, "Password minimal 6 karakter"],
  },
  role: {
    type: String,
    enum: ["user", "owner"],
    default: "user", // Perbaikan typo "default"
  },
});

// Middleware untuk hash password sebelum save
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//ini unutk deskripsi password, yang metodensnya di gunakan di login
userSchema.methods.comparePassword = async function (reqBody) {
  return await bcrypt.compare(reqBody, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
