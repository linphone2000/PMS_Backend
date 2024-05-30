import express from "express";
const router = express.Router();
import {
  addOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

router.route("/add").post(addOrder);
router.route("/").get(getOrders);
router.route("/:id").get(getOrderById);
router.route("/:id").put(updateOrder);
router.route("/:id").delete(deleteOrder);

export default router;
