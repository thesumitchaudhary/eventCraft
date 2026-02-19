import mongoose from "mongoose";

const eventThemeSchema = new mongoose.Schema(
    {
        themeName: {
            type: String,
            required: true,
        },

        themeType: {
            type: String,
            enum: ["Wedding", "birthday", "corporate"],
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