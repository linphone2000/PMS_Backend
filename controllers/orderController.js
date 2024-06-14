import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Customer from "../models/customerModel.js";
import Inventory from "../models/inventoryModel.js";

// Create a new order
const addOrder = asyncHandler(async (req, res) => {
  const {
    customerID,
    items,
    totalPrice,
    paymentMethod,
    deliveryAddress,
    remarks,
  } = req.body;

  const customer = await Customer.findById(customerID);
  if (!customer) {
    res.status(404).json({ message: "Customer not found." });
    throw new Error("Customer not found");
  }

  // Handle item quantities
  const populatedItems = [];
  for (const item of items) {
    const inventoryItem = await Inventory.findById(item.itemID);
    if (inventoryItem) {
      if (inventoryItem.quantity < item.quantity) {
        res.status(400).json({
          message: `Insufficient quantity for item: ${inventoryItem.itemName}`,
        });
        throw new Error(
          `Insufficient quantity for item: ${inventoryItem.itemName}`
        );
      }
      inventoryItem.quantity -= item.quantity;
      await inventoryItem.save();

      populatedItems.push({
        itemID: item.itemID,
        itemName: inventoryItem.itemName,
        quantity: item.quantity,
        price: inventoryItem.price,
      });
    } else {
      res.status(404).json({ message: "Item not found." });
      throw new Error(`Item not found: ${item.itemName}`);
    }
  }

  const order = new Order({
    customerID,
    items: populatedItems,
    totalPrice,
    paymentMethod,
    deliveryAddress,
    remarks,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// Get all orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate(
    "customerID",
    "name contactNumber email"
  );
  res.json(orders);
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "customerID",
    "name contactNumber email"
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found." });
    throw new Error("Order not found");
  }
});

const updateOrder = asyncHandler(async (req, res) => {
  const { status, items, totalPrice, paymentMethod, deliveryAddress, remarks } =
    req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    const oldStatus = order.status;

    // Update order details
    order.status = status || order.status;
    order.items = items || order.items;
    order.totalPrice = totalPrice || order.totalPrice;
    order.paymentMethod = paymentMethod || order.paymentMethod;
    order.deliveryAddress = deliveryAddress || order.deliveryAddress;
    order.remarks = remarks || order.remarks;

    // Handle item quantity addition if the order is cancelled
    if (oldStatus === "Pending" && status === "Cancelled") {
      for (const item of order.items) {
        const inventoryItem = await Inventory.findById(item.itemID);
        if (inventoryItem) {
          inventoryItem.quantity += item.quantity;
          await inventoryItem.save();
        }
      }
    }

    // Handle item quantity deduction if the order is pending
    if (oldStatus === "Cancelled" && status === "Pending") {
      for (const item of order.items) {
        const inventoryItem = await Inventory.findById(item.itemID);
        if (inventoryItem) {
          if (inventoryItem.quantity < item.quantity) {
            res.status(400).json({
              message: `Insufficient quantity for item: ${inventoryItem.itemName}`,
            });
            throw new Error(
              `Insufficient quantity for item: ${inventoryItem.itemName}`
            );
          }
          inventoryItem.quantity -= item.quantity;
          await inventoryItem.save();
        } else {
          res.status(404).json({ message: `Item not found: ${item.itemName}` });
          throw new Error(`Item not found: ${item.itemName}`);
        }
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
    throw new Error("Order not found");
  }
});

// Delete order
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Handle item quantity addition
    if (order.status == "Pending") {
      for (const item of order.items) {
        const inventoryItem = await Inventory.findById(item.itemID);
        if (inventoryItem) {
          inventoryItem.quantity += item.quantity;
          await inventoryItem.save();
        }
      }
    }

    await Order.deleteOne({ _id: req.params.id });
    res.json({ message: "Order removed" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export { addOrder, getOrders, getOrderById, updateOrder, deleteOrder };
