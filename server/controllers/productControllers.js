import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModels.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const createProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  return res.status(201).json({
    message: "Berhasil menambahkan Product",
    date: {
      newProduct,
    },
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };

  const excludeFile = ["page", "limit", "name"];
  excludeFile.forEach((element) => delete queryObj[element]);

  let query;
  if (req.query.name) {
    query = Product.findOne({
      name: { $regex: req.query.name, $options: "i" },
    });
  } else {
    query = Product.find(queryObj);
  }

  const page = req.query.page * 1 || 1;
  const limitData = req.query.limit * 1 || 30;
  const skipData = (page - 1) * limitData;

  query = query.skip(skipData).limit(limitData);

  const countProduct = await Product.countDocuments();
  if (req.query.page) {
    if (skipData >= countProduct) {
      res.status(404).json({
        message: "Halaman tidak tersedia",
      });
    }
  }

  const Products = await query;

  res.status(200).json({
    message: "Berhasil menampilkan semua data",
    data: Products,
    count: countProduct,
  });
});

export const getDetailProductId = asyncHandler(async (req, res) => {
  const pamaramsId = req.params.id;

  const detailProduct = await Product.findById(pamaramsId);

  if (!detailProduct) {
    return res.status(404).json({
      message: "Product tidak ditemukan",
    });
  }

  res.status(200).json({
    message: "Berhasil menampilkan data bersdasarkan id",
    data: detailProduct,
  });
});

export const updateProductId = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;

  const updateProduct = await Product.findByIdAndUpdate(paramsId, req.body, {
    runValidators: false,
    new: true,
  });
  res.status(201).json({
    message: "Berhasil memperbarui data",
    data: updateProduct,
  });
});

export const deleteProductId = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;

  const deteleProduct = await Product.findByIdAndDelete(paramsId);

  res.status(200).json({
    message: "Berhasil menghapus data",
    data: deteleProduct,
  });
});

export const fileProduct = asyncHandler(async (req, res) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "uploads",
      allowed_formats: ["png", "jpg", "jpeg"],
    },
    function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Gagal mengupload gambar",
          error: err,
        });
      }
      res.status(200).json({
        message: "Gambar berhasil diupload",
        url: result.secure_url,
      });
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(stream);
});
