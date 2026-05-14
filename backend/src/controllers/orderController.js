import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const orderProjection = "-__v";
const orderPopulate = [
  { path: "createdBy", select: "username role" },
  { path: "items.product", select: "name category price variants isAvailable" },
];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeTextArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseDateBoundary = (value, isEnd = false) => {
  if (!value || typeof value !== "string") {
    return null;
  }

  const date = new Date(`${value}${isEnd ? "T23:59:59.999Z" : "T00:00:00.000Z"}`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const buildOrderItem = async (item, index) => {
  if (!item?.product || !isValidObjectId(item.product)) {
    throw new Error(`Invalid product id for item ${index + 1}`);
  }

  const product = await Product.findById(item.product);

  if (!product) {
    throw new Error(`Product not found for item ${index + 1}`);
  }

  const quantity = Number(item.quantity);
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error(`Quantity must be at least 1 for item ${index + 1}`);
  }

  const requestedVariantName =
    typeof item.variantName === "string" ? item.variantName.trim() : "";

  let unitPrice;
  let variantName = "";

  if (requestedVariantName) {
    const matchedVariant = product.variants.find(
      (variant) => variant.name === requestedVariantName,
    );

    if (!matchedVariant) {
      throw new Error(
        `Variant "${requestedVariantName}" not found for product "${product.name}"`,
      );
    }

    unitPrice = matchedVariant.price;
    variantName = matchedVariant.name;
  } else if (typeof product.price === "number") {
    unitPrice = product.price;
  } else if (product.variants.length > 0) {
    throw new Error(`Variant is required for product "${product.name}"`);
  } else {
    throw new Error(`Product "${product.name}" does not have valid pricing`);
  }

  return {
    product: product._id,
    productName: product.name,
    variantName,
    quantity,
    unitPrice,
    totalPrice: unitPrice * quantity,
    removedIngredients: normalizeTextArray(item.removedIngredients),
    addedIngredients: normalizeTextArray(item.addedIngredients),
    note: typeof item.note === "string" ? item.note.trim() : "",
  };
};

const createOrder = async (req, res, next) => {
  try {
    const { items, note } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400);
      throw new Error("Order items are required");
    }

    const processedItems = [];

    for (const [index, item] of items.entries()) {
      processedItems.push(await buildOrderItem(item, index));
    }

    const totalAmount = processedItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    const lastOrder = await Order.findOne().sort({ orderNumber: -1 }).select(
      "orderNumber",
    );
    const orderNumber = lastOrder?.orderNumber ? lastOrder.orderNumber + 1 : 1;

    const order = await Order.create({
      orderNumber,
      items: processedItems,
      totalAmount,
      createdBy: req.user.id,
      note,
    });

    const createdOrder = await Order.findById(order._id)
      .select(orderProjection)
      .populate(orderPopulate);

    res.status(201).json(createdOrder);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400);
    }

    if (!res.statusCode || res.statusCode === 200) {
      res.status(400);
    }

    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const filters = {};

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.createdBy) {
      if (!isValidObjectId(req.query.createdBy)) {
        res.status(400);
        throw new Error("Invalid createdBy filter");
      }

      filters.createdBy = req.query.createdBy;
    }

    const dateFrom = parseDateBoundary(req.query.dateFrom);
    const dateTo = parseDateBoundary(req.query.dateTo, true);

    if ((req.query.dateFrom && !dateFrom) || (req.query.dateTo && !dateTo)) {
      res.status(400);
      throw new Error("Invalid date filter");
    }

    if (dateFrom || dateTo) {
      filters.createdAt = {};

      if (dateFrom) {
        filters.createdAt.$gte = dateFrom;
      }

      if (dateTo) {
        filters.createdAt.$lte = dateTo;
      }
    }

    const orders = await Order.find(filters)
      .select(orderProjection)
      .populate(orderPopulate)
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Invalid order id");
    }

    const order = await Order.findById(req.params.id)
      .select(orderProjection)
      .populate(orderPopulate);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      res.status(400);
      throw new Error("Invalid order id");
    }

    const { status } = req.body;

    if (!["in_progress", "done"].includes(status)) {
      res.status(400);
      throw new Error('Status must be either "in_progress" or "done"');
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    order.status = status;
    const updatedOrder = await order.save();

    const responseOrder = await Order.findById(updatedOrder._id)
      .select(orderProjection)
      .populate(orderPopulate);

    res.status(200).json(responseOrder);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400);
    }

    next(error);
  }
};

export { createOrder, getOrders, getOrderById, updateOrderStatus };
