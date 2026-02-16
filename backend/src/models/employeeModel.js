import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: mongoose.Schema.Type.ObjectId,
    //   ref: "user",
    // },
    department: String,
    joiningDate: Date,
    designation: String,
    assignedTask: Number,
    taskStatus: Number,
    workUpdates: Number,
  }
);

export default mongoose.model("Employee", employeeSchema);
