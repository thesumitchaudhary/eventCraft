import employeeModel from "../models/employeeModel.js";
import eventBookingModel from "../models/eventBookingModel.js";
import assignTaskModel from "../models/assignTaskModel.js";


// this task is assign only by admin to employee
export const createTask =  async (req, res) => {
    try {
        const {
            selectedEventId,
            eventId,
            taskTitle,
            taskDescription,
            assignTo,
            priority,
            selectDate,
        } = req.body;

        const finalEventId = selectedEventId || eventId;

        if (!finalEventId || !taskTitle || !taskDescription || !assignTo || !selectDate) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        if (!mongoose.isValidObjectId(finalEventId) || !mongoose.isValidObjectId(assignTo)) {
            return res.status(400).json({ message: "Invalid eventId or assignTo" });
        }

        const eventExists = await eventBookingModel.exists({ _id: finalEventId });
        if (!eventExists) {
            return res.status(404).json({ message: "Event not found" });
        }

        // accept Employee._id first
        let employee = await employeeModel.findById(assignTo).select("_id userId");

        // fallback: if frontend sent User._id, map it to Employee._id
        if (!employee) {
            employee = await employeeModel.findOne({ userId: assignTo }).select("_id userId");
        }

        if (!employee) {
            return res.status(400).json({ message: "assignTo must be a valid Employee/User id linked to Employee" });
        }

        const assignTask = await assignTaskModel.create({
            eventId: finalEventId,
            taskTitle: taskTitle.trim(),
            taskDescription: taskDescription.trim(),
            assignTo: employee._id, // always store Employee._id
            priority,
            selectDate,
        });

        await employeeModel.findOneAndUpdate(
            employee._id,
            { $push: { tasks: assignTask._id } },
            { new: true }
        );
        return res.status(201).json({ assignTask });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}