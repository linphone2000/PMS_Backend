import asyncHandler from "express-async-handler";
import Supplier from "../models/supplierModel.js";
import Inventory from "../models/inventoryModel.js";

// Register Supplier
const registerSupplier = asyncHandler(async (req, res) => {
  const {
    supplierName,
    contactPerson,
    contactNumber,
    email,
    address,
    contractStartDate,
    contractEndDate,
    paymentTerms,
  } = req.body;

  // Check for existing supplier with email
  const existingSupplier = await Supplier.findOne({ email });
  if (existingSupplier) {
    return res.status(400).json({ message: "Supplier already exists" });
  }

  const supplier = await Supplier.create({
    supplierName,
    contactPerson,
    contactNumber,
    email,
    address,
    contractStartDate,
    contractEndDate,
    paymentTerms,
  });

  if (supplier) {
    const supplierData = {
      _id: supplier._id,
      supplierName: supplier.supplierName,
      contactPerson: supplier.contactPerson,
      contactNumber: supplier.contactNumber,
      email: supplier.email,
      address: supplier.address,
      contractStartDate: supplier.contractStartDate,
      contractEndDate: supplier.contractEndDate,
      paymentTerms: supplier.paymentTerms,
    };
    res.status(200).json({
      message: "Supplier registration successful!",
      supplier: supplierData,
    });
  } else {
    res.status(400);
    throw new Error("Invalid supplier data");
  }
});

// Get all Suppliers
const getSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await Supplier.find();
  if (suppliers) {
    res.status(200).json({ suppliers });
  } else {
    res.status(404).json({ message: "No suppliers found" });
  }
});

// Get Supplier by id
const getSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (supplier) {
    const supplierData = {
      _id: supplier._id,
      supplierName: supplier.supplierName,
      contactPerson: supplier.contactPerson,
      contactNumber: supplier.contactNumber,
      email: supplier.email,
      address: supplier.address,
      contractStartDate: supplier.contractStartDate,
      contractEndDate: supplier.contractEndDate,
      paymentTerms: supplier.paymentTerms,
    };
    res.status(200).json({ supplier: supplierData });
  } else {
    res.status(404).json({ message: "Supplier not found" });
  }
});

// Update Supplier by id
const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (supplier) {
    supplier.supplierName = req.body.supplierName || supplier.supplierName;
    supplier.contactPerson = req.body.contactPerson || supplier.contactPerson;
    supplier.contactNumber = req.body.contactNumber || supplier.contactNumber;
    supplier.email = req.body.email || supplier.email;
    supplier.address = req.body.address || supplier.address;
    supplier.contractStartDate =
      req.body.contractStartDate || supplier.contractStartDate;
    supplier.contractEndDate =
      req.body.contractEndDate || supplier.contractEndDate;
    supplier.paymentTerms = req.body.paymentTerms || supplier.paymentTerms;

    const updatedSupplier = await supplier.save();
    const supplierData = {
      _id: updatedSupplier._id,
      supplierName: updatedSupplier.supplierName,
      contactPerson: updatedSupplier.contactPerson,
      contactNumber: updatedSupplier.contactNumber,
      email: updatedSupplier.email,
      address: updatedSupplier.address,
      contractStartDate: updatedSupplier.contractStartDate,
      contractEndDate: updatedSupplier.contractEndDate,
      paymentTerms: updatedSupplier.paymentTerms,
    };

    res
      .status(200)
      .json({ message: "Supplier updated", supplier: supplierData });
  } else {
    res.status(404).json({ message: "Supplier not found" });
  }
});

// Delete Supplier by id
const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (supplier) {
    await Inventory.updateMany({ supplier: req.params.id }, { supplier: null });
    await Supplier.deleteOne({ _id: req.params.id });
    res.json({ message: "Supplier removed" });
  } else {
    res.status(404);
    throw new Error("Supplier not found");
  }
});

export {
  registerSupplier,
  getSuppliers,
  getSupplier,
  updateSupplier,
  deleteSupplier,
};
