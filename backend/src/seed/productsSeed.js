import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();

const classicVariants = [
  { name: "Double", price: 10 },
  { name: "Triple", price: 12 },
  { name: "Double Double", price: 14 },
  { name: "Triple Double", price: 16 },
  { name: "Triple Triple", price: 18 },
];

const dryAgedVariants = [
  { name: "Double", price: 11 },
  { name: "Triple", price: 14 },
  { name: "Double Double", price: 17 },
  { name: "Triple Double", price: 20 },
  { name: "Triple Triple", price: 23 },
];

const tartufoloVariants = [
  { name: "Double", price: 12 },
  { name: "Triple", price: 15 },
  { name: "Double Double", price: 18 },
  { name: "Triple Double", price: 21 },
  { name: "Triple Triple", price: 24 },
];

const products = [
  {
    name: "Classic Smash",
    category: "burger",
    description:
      "2x pljeskavica, chedar sir, burger sos, iceberg salata, kiseli krastavci, ljubičasti luk",
    variants: classicVariants,
    displayOrder: 1,
  },
  {
    name: "Onyo Smash",
    category: "burger",
    description:
      "2x pljeskavica, chedar sir, burger sos, karamelizirani luk, iceberg salata, kiseli krastavci",
    variants: classicVariants,
    displayOrder: 2,
  },
  {
    name: "Western Smash",
    category: "burger",
    description:
      "2x pljeskavica, chedar sir, burger sos, džem od suhog mesa, iceberg salata, kiseli krastavci, ljubičasti luk",
    variants: classicVariants,
    displayOrder: 3,
  },
  {
    name: "Blue Cheese Smash",
    category: "burger",
    description:
      "2x pljeskavica, chedar sir, blue cheese sos, iceberg salata, kiseli krastavci, ljubičasti luk",
    variants: classicVariants,
    displayOrder: 4,
  },
  {
    name: "Jalapeno BBQ Smash",
    category: "burger",
    description:
      "2x pljeskavica, chedar sir, burger sos, jalapeno papričice, iceberg salata, kiseli krastavci, ljubičasti luk",
    variants: classicVariants,
    displayOrder: 5,
  },
  {
    name: "Oklahoma Smash",
    category: "burger",
    description:
      "2x pljeskavica, chedar sir, burger sos, iceberg salata, kiseli krastavci, grilovani luk",
    variants: classicVariants,
    displayOrder: 6,
  },
  {
    name: "Khabib Smash",
    category: "burger",
    description:
      "2x pljeskavica, chedar sir, chilli majoneza, iceberg salata, kiseli krastavci, ljubičasti luk",
    variants: classicVariants,
    displayOrder: 7,
  },
  {
    name: "Italiano Smash",
    category: "burger",
    description:
      "2x pljeskavica, mozzarella, burger sos, pesto genovese, rukola",
    variants: classicVariants,
    displayOrder: 8,
  },
  {
    name: "Dry Aged Smash",
    category: "burger",
    description:
      "2x pljeskavica od odležanog junećeg mesa, burger sos, iceberg salata, kiseli krastavci, ljubičasti luk",
    variants: dryAgedVariants,
    displayOrder: 9,
  },
  {
    name: "Dry Aged Tartufolo",
    category: "burger",
    description:
      "2x pljeskavica od odležanog junećeg mesa, sos od tartufa, iceberg salata, kiseli krastavci, ljubičasti luk",
    variants: tartufoloVariants,
    displayOrder: 10,
  },
  {
    name: "Pomfrit",
    category: "side",
    description: "200g",
    price: 3,
    displayOrder: 1,
  },
  {
    name: "Pekarski krompir",
    category: "side",
    description: "200g",
    price: 3,
    displayOrder: 2,
  },
  {
    name: "Onion Rings",
    category: "side",
    description: "200g",
    price: 4,
    displayOrder: 3,
  },
  {
    name: "Mozzarella Sticks",
    category: "side",
    description: "5 sticks",
    price: 5,
    displayOrder: 4,
  },
  {
    name: "jalapeno balls",
    category: "side",
    description: "5 balls",
    price: 5,
    displayOrder: 5,
  },
  {
    name: "Blue Cheese",
    category: "sauce",
    description: "30ml",
    price: 2,
    displayOrder: 1,
  },
  {
    name: "Chilli Mayo",
    category: "sauce",
    description: "30ml",
    price: 2,
    displayOrder: 2,
  },
  {
    name: "BBQ",
    category: "sauce",
    description: "30ml",
    price: 2,
    displayOrder: 3,
  },
  {
    name: "Tartufolo",
    category: "sauce",
    description: "30ml",
    price: 3.5,
    displayOrder: 4,
  },
  {
    name: "Heinz",
    category: "sauce",
    description: "30ml",
    price: 1,
    displayOrder: 5,
  },
];

const seedProducts = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment");
    }

    await connectDB();

    const adminUser = await User.findOne({ username: "admin" });

    if (!adminUser) {
      throw new Error('Admin user with username "admin" was not found');
    }

    await Product.deleteMany({});

    const productsToInsert = products.map((product) => ({
      ...product,
      createdBy: adminUser._id,
      updatedBy: adminUser._id,
    }));

    await Product.insertMany(productsToInsert);

    console.log(`Successfully seeded ${productsToInsert.length} products.`);
  } catch (error) {
    console.error(`Product seeding failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

void seedProducts();
