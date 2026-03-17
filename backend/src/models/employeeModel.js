import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignTask",
    }],
    phone: Number,
    department: String,
    joiningDate: Date,
    designation: String,
  }
);

export default mongoose.model("Employee", employeeSchema);
