import mongoose from "mongoose";

const supplierSchema = mongoose.Schema(
  {
    supplierName: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contractStartDate: {
      type: Date,
      required: true,
    },
    contractEndDate: {
      type: Date,
      required: true,
    },
    paymentTerms: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
