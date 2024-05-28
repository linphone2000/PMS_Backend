import asyncHandler from "express-async-handler";
import Inventory from "../models/inventoryModel.js";
import Supplier from "../models/supplierModel.js";

// Create a new inventory item
const addItem = asyncHandler(async (req, res) => {
  const {
    itemName,
    quantity,
    price,
    supplierId,
    expiryDate,
    status,
    category,
  } = req.body;

  const supplier = await Supplier.findById(supplierId);

  if (!supplier) {
    res.status(404);
    throw new Error("Supplier not found");
  }

  const item = new Inventory({
    itemName,
    quantity,
    price,
    supplier: supplierId,
    expiryDate,
    status,
    category,
    image: req.file ? req.file.filename : null,
  });

  const createdItem = await item.save();
  res.status(201).json(createdItem);
});

// Get all inventory items
const getItems = asyncHandler(async (req, res) => {
  const items = await Inventory.find().populate(
    "supplier",
    "supplierName contactPerson"
  );
  res.json(items);
});

// Get inventory item by ID
const getItemById = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id).populate(
    "supplier",
    "supplierName contactPerson"
  );

  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// Update inventory item
const updateItem = asyncHandler(async (req, res) => {
  const {
    itemName,
    quantity,
    price,
    supplierId,
    expiryDate,
    status,
    category,
  } = req.body;

  const item = await Inventory.findById(req.params.id);

  if (item) {
    item.itemName = itemName || item.itemName;
    item.quantity = quantity || item.quantity;
    item.price = price || item.price;
    item.supplier = supplierId || item.supplier;
    item.expiryDate = expiryDate || item.expiryDate;
    item.status = status || item.status;
    item.category = category || item.category;
    if (req.file) {
      item.image = req.file.filename;
    }

    const updatedItem = await item.save();
    res.json(updatedItem);
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

// Delete inventory item
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Inventory.findById(req.params.id);

  if (item) {
    await Inventory.deleteOne({ _id: req.params.id });
    res.json({ message: "Item removed" });
  } else {
    res.status(404);
    throw new Error("Item not found");
  }
});

export { addItem, getItems, getItemById, updateItem, deleteItem };
