import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    phone: {
      type:String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Admin", adminSchema);
