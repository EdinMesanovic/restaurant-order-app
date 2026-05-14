import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/productController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorizeRoles("admin"), createProduct)
  .get(authorizeRoles("admin", "worker"), getProducts);

router
  .route("/:id")
  .get(authorizeRoles("admin", "worker"), getProductById)
  .put(authorizeRoles("admin"), updateProduct)
  .delete(authorizeRoles("admin"), deleteProduct);

export default router;
