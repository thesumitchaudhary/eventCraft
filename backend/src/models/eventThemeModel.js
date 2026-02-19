import mongoose from "mongoose";

const eventThemeSchema = new mongoose.Schema(
    {
        themeName: {
            type: String,
            required: true,
        },

        themeType: {
            type: String,
            enum: ["Wedding", "Birthday", "Corporate", "Anniversary"],
            default: "Wedding"
        },

        themePrice: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("EventTheme", eventThemeSchema);