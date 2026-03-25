import WorkUpdate from "../models/WorkUpdate";
import { putObjectURL, getObjectURL, deleteObject } from "../config/s3";
import redis from "../config/redis";

// 🔵 Generate upload URL
exports.generateUploadURL = async (req, res) => {
    try {
        const { fileName, contentType } = req.body;

        const key = `uploads/user-upload/${Date.now()}-${fileName}`;

        const url = await putObjectURL(key, contentType);

        res.json({ uploadURL: url, key });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🟢 Create WorkUpdate with file
exports.createWorkUpdate = async (req, res) => {
    try {
        const { taskId, employeeId, status, progress, note, key, fileName, contentType } = req.body;

        const work = await WorkUpdate.create({
            taskId,
            employeeId,
            status,
            progress,
            note,
            evidence: {
                key,
                fileName,
                contentType,
            },
        });

        res.json(work);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🔵 Get WorkUpdate with signed URL
exports.getWorkUpdate = async (req, res) => {
    try {
        const work = await WorkUpdate.findById(req.params.id);

        if (!work) return res.status(404).json({ error: "Not found" });

        let url = null;

        if (work.evidence?.key) {
            const redisKey = `signed-url:${work.evidence.key}`;

            url = await redis.get(redisKey);

            if (!url) {
                url = await getObjectURL(work.evidence.key);
                await redis.set(redisKey, url, "EX", 50);
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

// 🔴 Delete WorkUpdate + file
exports.deleteWorkUpdate = async (req, res) => {
    try {
        const work = await WorkUpdate.findById(req.params.id);

        if (!work) return res.status(404).json({ error: "Not found" });

        if (work.evidence?.key) {
            await deleteObject(work.evidence.key);
            await redis.del(`signed-url:${work.evidence.key}`);
        }

        await WorkUpdate.findByIdAndDelete(req.params.id);

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};