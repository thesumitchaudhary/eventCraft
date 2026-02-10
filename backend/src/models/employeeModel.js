import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      //   required: true,
      //   trim: true,
    },

    lastname: {
      type: String,
      //   required: true,
      //   trim: true,
    },

    email: {
      type: String,
      //   required: true,
      //   unique: true,
      //   lowercase: true,
      //   trim: true,
    },

    password: {
      type: String,
      //   required: true,
      minlength: 6,
      //   select: false, // prevents password from returning in queries
    },

    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },

    designation: {
      type: String,
    },

    assignedTasks: {
      type: Number,
      default: 0,
    },

    taskStatus: {
      type: Number,
      default: 0,
    },

    workUpdates: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Employee", employeeSchema);
