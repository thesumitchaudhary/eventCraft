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
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Admin", adminSchema);
