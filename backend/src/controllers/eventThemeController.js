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

export const deleteEventTheme =  async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await eventThemeModel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Theme not found" });
        }
        res.json({ message: "Deleted successfully", deleted });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateEventTheme = async (req, res) => {
    try {
        const { themeName, themeType, themePrice } = req.body;
        const { id } = req.params;

        const updatedTheme = await eventThemeModel.findByIdAndUpdate(
            id,
            {
                themeName,
                themeType,
                themePrice
            },
            { new: true }
        );

        if (!updatedTheme) {
            return res.status(400).json({ message: "Theme does not exist" });
        }

        res.status(200).json({
            message: "Theme is updated successfully",
            data: updatedTheme
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}