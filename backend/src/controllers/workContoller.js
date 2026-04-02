import WorkUpdate from "../models/workUpdateModel.js";
import assignTask from "../models/assignTaskModel.js";
import eventBookingModel from "../models/eventBookingModel.js";
import { putObjectURL, getObjectURL, uploadObject, deleteObject } from "../config/s3.js";
import redis from "../config/Redis.js";

export const generateUploadURL = async (req, res) => {
    try {
        const { fileName, contentType } = req.body;

        if (!fileName || !contentType) {
            return res.status(400).json({ error: "fileName and contentType are required" });
        }

        const safeName = String(fileName).trim().replace(/\s+/g, "-");
        const key = `uploads/user-upload/${Date.now()}-${safeName}`;


        const url = await putObjectURL(key, contentType);

        res.json({ uploadURL: url, key });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createWorkUpdate = async (req, res) => {
    try {
        const {
            taskId,
            employeeId,
            status,
            note,
            key,
            fileName,
            progress,
            contentType
        } = req.body;

        // 1. Save work update
        const work = await WorkUpdate.create({
            taskId,
            employeeId,
            note,
            evidence: {
                key,
                fileName,
                contentType,
            },
        });

        // 2. Update task status
        await assignTask.findByIdAndUpdate(taskId, { status });

        // 3. Get eventId
        const task = await assignTask.findById(taskId);
        const eventId = task.eventId;

        // 4. Calculate progress
        const totalTasks = await assignTask.countDocuments({ eventId });

        const completedTasks = await assignTask.countDocuments({
            eventId,
            status: "completed"
        });


        // 5. Update event progress
        await eventBookingModel.findByIdAndUpdate(eventId, { progress });

        res.json({
            work,
            progress
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 

export const getWorkUpdate = async (req, res) => {
    try {
        const work = await WorkUpdate.findById(req.params.id);

        if (!work) return res.status(404).json({ error: "Not found" });

        let url = null;

        if (work.evidence?.key) {
            const redisKey = `signed-url:${work.evidence.key}`;

            try {
                url = await redis.get(redisKey);
            } catch (_err) {
                url = null;
            }

            if (!url) {
                url = await getObjectURL(work.evidence.key);
                try {
                    await redis.set(redisKey, url, "EX", 50);
                } catch (_err) {
                    // Cache write failures should not block API responses.
                }
            }
        }

        res.json({
            ...work.toObject(),
            evidenceUrl: url,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteWorkUpdate = async (req, res) => {
    try {
        const work = await WorkUpdate.findById(req.params.id);

        if (!work) return res.status(404).json({ error: "Not found" });

        if (work.evidence?.key) {
            await deleteObject(work.evidence.key);
            try {
                await redis.del(`signed-url:${work.evidence.key}`);
            } catch (_err) {
                // Cache delete failures should not block resource deletion.
            }
        }

        await WorkUpdate.findByIdAndDelete(req.params.id);

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const uploadWorkEvidenceViaBackend = async (req, res) => {
    try {
        const { fileName, contentType, fileBase64 } = req.body;

        if (!fileName || !contentType || !fileBase64) {
            return res.status(400).json({ error: "fileName, contentType and fileBase64 are required" });
        }

        const safeName = String(fileName).trim().replace(/\s+/g, "-");
        const key = `uploads/user-upload/${Date.now()}-${safeName}`;
        const buffer = Buffer.from(String(fileBase64), "base64");

        await uploadObject(key, buffer, contentType);

        res.json({ key, fileName, contentType });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};