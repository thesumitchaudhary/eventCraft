import eventThemeModel from "../models/eventThemeModel.js";



// import middleware for protecting routes
import authMiddleware from "../Middleware/authMiddleware.js";
import adminMiddleware from "../Middleware/adminMiddleware.js";



export const getAllThemes = async (req, res) => {
    try {
        const getEventThemes = await eventThemeModel.find();

        if (!getEventThemes) {
            res.json("there was not theme available")
        }

        res.json(getEventThemes);
    } catch (error) {
        res.json({ message: error })
    }
}

export const addEventTheme = async (req, res) => {
    try {
        const { themeName, themeType, themePrice } = req.body;
        const eventThemeCreated = await eventThemeModel.create({
            themeName,
            themeType,
            themePrice
        })
        res.json(eventThemeCreated)
    }
    catch (error) {
        res.json({ message: error })
    }
}