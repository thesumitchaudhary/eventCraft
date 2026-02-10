import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  { 
    firstname: {
      type: String,
      // required: true,
      // trim: true,
    },

    lastname: {
      type: String,
      // required: true,
      // trim: true,
    },

    email: {
      type: String,
      // required: true,
      // unique: true,
      // lowercase: true,
    },

    password: {
      type: String,
      // required: true,
      // minlength: 6,
      // select: false,
    },

    phone: {
      type: String,
      // required: true,
    },

    address: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);
