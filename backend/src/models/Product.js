import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Variant name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Variant price is required"],
      min: [0, "Variant price cannot be negative"],
    },
  },
  {
    _id: false,
  },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["burger", "side", "sauce", "drink"],
      default: "burger",
    },
    price: {
      type: Number,
      default: null,
      min: [0, "Price cannot be negative"],
    },
    variants: {
      type: [productVariantSchema],
      default: [],
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("validate", function validatePricing(next) {
  const hasDirectPrice = typeof this.price === "number";
  const hasVariants = Array.isArray(this.variants) && this.variants.length > 0;

  if (!hasDirectPrice && !hasVariants) {
    this.invalidate(
      "price",
      "Product must include either a direct price or at least one variant",
    );
  }

  if (hasDirectPrice && hasVariants) {
    this.invalidate(
      "price",
      "Product cannot have both a direct price and variants",
    );
  }

  if (this.category !== "burger" && hasVariants) {
    this.invalidate(
      "variants",
      "Only products in the burger category can use variants",
    );
  }

  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
