import mongoose from "mongoose";
import eventThemeModel from "./models/eventThemeModel.js";
import dotenv from "dotenv"

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

console.log(MONGO_URI)

await mongoose.connect(MONGO_URI)

await eventThemeModel.insertMany([
    {
        themeName: "Classic Elegant",
        themeType: "Wedding",
        themePrice: "$5000",
    },
    {
        themeName: "Modern Minimalist",
        themeType: "Wedding",
        themePrice: "$4500",
    },
    {
        themeName: "Rustic Charm",
        themeType: "Wedding",
        themePrice: "$4000",
    },
    {
        themeName: "Beach Paradise",
        themeType: "Wedding",
        themePrice: "$6000",
    },
    {
        themeName: "Corporate Professional",
        themeType: "Corporate",
        themePrice: "$3000",
    },
    {
        themeName: "Tech Innovation",
        themeType: "Corporate",
        themePrice: "$3500",
    },
    {
        themeName: "Kids Wonderland",
        themeType: "Birthday",
        themePrice: "$2000",
    },
    {
        themeName: "Hollywood Glamour",
        themeType: "Birthday",
        themePrice: "$2500",
    },
    {
        themeName: "Romantic Garden",
        themeType: "Anniversary",
        themePrice: "$3000",
    },
    {
        themeName: "Vintage Romance",
        themeType: "Anniversary",
        themePrice: "$3200",
    },
]);

console.log("theme is inserted");
process.exit();