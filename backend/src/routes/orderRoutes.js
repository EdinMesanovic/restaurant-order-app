import express from "express";
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin", "worker"));

router.route("/").post(createOrder).get(getOrders);
router.route("/:id").get(getOrderById);
router.route("/:id/status").put(updateOrderStatus);

export default router;
