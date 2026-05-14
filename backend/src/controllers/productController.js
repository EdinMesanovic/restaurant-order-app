import mongoose from "mongoose";
import Product from "../models/Product.js";

const productProjection = "-__v";
const productPopulate = [
  { path: "createdBy", select: "username role" },
  { path: "updatedBy", select: "username role" },
];

const normalizeVariants = (variants) => {
  if (!Array.isArray(variants)) {
    return [];
  }

  return variants.map((variant) => ({
    name: typeof variant?.name === "string" ? variant.name.trim() : variant?.name,
    price: variant?.price,
  }));
};

const parseAvailabilityFilter = (value) => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      price,
      variants,
      image,
      isAvailable,
      displayOrder,
    } = req.body;

    if (!name?.trim()) {
      res.status(400);
      throw new Error("Product name is required");
    }

    const product = await Product.create({
      name: name.trim(),
      description,
      category,
      price,
      variants: normalizeVariants(variants),
      image,
      isAvailable,
      displayOrder,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    const createdProduct = await Product.findById(product._id)
      .select(productProjection)
      .populate(productPopulate);

    res.status(201).json(createdProduct);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400);
    }

    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const filters = {};

    if (req.query.category) {
      filters.category = req.query.category;
    }

    const isAvailable = parseAvailabilityFilter(req.query.isAvailable);
    if (typeof isAvailable === "boolean") {
      filters.isAvailable = isAvailable;
    }

    const products = await Product.find(filters)
      .select(productProjection)
      .populate(productPopulate)
      .sort({ displayOrder: 1, createdAt: 1 });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Invalid product id");
    }

    const product = await Product.findById(req.params.id)
      .select(productProjection)
      .populate(productPopulate);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Invalid product id");
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const {
      name,
      description,
      category,
      price,
      variants,
      image,
      isAvailable,
      displayOrder,
    } = req.body;

    if (typeof name !== "undefined") {
      if (!name?.trim()) {
        res.status(400);
        throw new Error("Product name cannot be empty");
      }

      product.name = name.trim();
    }

    if (typeof description !== "undefined") {
      product.description = description;
    }

    if (typeof category !== "undefined") {
      product.category = category;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "price")) {
      product.price = price;
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "variants")) {
      product.variants = normalizeVariants(variants);
    }

    if (typeof image !== "undefined") {
      product.image = image;
    }

    if (typeof isAvailable === "boolean") {
      product.isAvailable = isAvailable;
    }

    if (typeof displayOrder !== "undefined") {
      product.displayOrder = displayOrder;
    }

    product.updatedBy = req.user.id;

    const updatedProduct = await product.save();
    const responseProduct = await Product.findById(updatedProduct._id)
      .select(productProjection)
      .populate(productPopulate);

    res.status(200).json(responseProduct);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400);
    }

    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Invalid product id");
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    product.isAvailable = false;
    product.updatedBy = req.user.id;
    await product.save();

    res.status(200).json({ message: "Product marked as unavailable" });
  } catch (error) {
    next(error);
  }
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
