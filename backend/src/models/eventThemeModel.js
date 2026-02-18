import mongoose from "mongoose";

const eventThemeSchema = new mongoose.Schema(
    {
        themeName: {
            type: String,
            required: true,
            trim: true
        },

        themeType: {
            type: String,
            enum: ["wedding", "birthday", "corporate"],
            default: "wedding"
        },

        themePrice: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("EventTheme", eventThemeSchema);