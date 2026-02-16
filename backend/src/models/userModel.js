import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    role: {
        type: String,
        enum: ["admin", "employee", "customer"],
        default: "customer",
        require: true,
    },
    verificationCode: String,
    verified_at: Date,
},
    { timestamps: true }
)

export default mongoose.model("user", userSchema);