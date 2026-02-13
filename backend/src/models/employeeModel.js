import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type:mongoose.Schema.Type.ObjectId,
      ref:"user",
    },
    designation:String,
    assigned
  }
);

export default mongoose.model("Employee", employeeSchema);
