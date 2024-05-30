import express from "express";
const router = express.Router();
import {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController.js";

router.route("/").post(addCustomer);
router.route("/").get(getCustomers);
router.route("/:id").get(getCustomerById);
router.route("/:id").put(updateCustomer);
router.route("/:id").delete(deleteCustomer);

export default router;
