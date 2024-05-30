import asyncHandler from "express-async-handler";
import Customer from "../models/customerModel.js";

// Create a new customer
const addCustomer = asyncHandler(async (req, res) => {
  const { name, contactNumber, email, address } = req.body;

  const customerExists = await Customer.findOne({ email });

  if (customerExists) {
    res.status(400);
    throw new Error("Customer already exists");
  }

  const customer = new Customer({
    name,
    contactNumber,
    email,
    address,
  });

  const createdCustomer = await customer.save();
  res.status(201).json(createdCustomer);
});

// Get all customers
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

// Get customer by ID
const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (customer) {
    res.json(customer);
  } else {
    res.status(404);
    throw new Error("Customer not found");
  }
});

// Update customer
const updateCustomer = asyncHandler(async (req, res) => {
  const { name, contactNumber, email, address } = req.body;

  const customer = await Customer.findById(req.params.id);

  if (customer) {
    customer.name = name || customer.name;
    customer.contactNumber = contactNumber || customer.contactNumber;
    customer.email = email || customer.email;
    customer.address = address || customer.address;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } else {
    res.status(404);
    throw new Error("Customer not found");
  }
});

// Delete customer
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (customer) {
    await Customer.deleteOne({ _id: req.params.id });
    res.json({ message: "Customer removed" });
  } else {
    res.status(404);
    throw new Error("Customer not found");
  }
});

export {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
