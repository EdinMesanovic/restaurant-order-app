import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(authorizeRoles("admin"), createUser)
  .get(authorizeRoles("admin"), getUsers);

router
  .route("/:id")
  .get(authorizeRoles("admin"), getUserById)
  .put(authorizeRoles("admin"), updateUser)
  .delete(authorizeRoles("admin"), deleteUser);

export default router;
