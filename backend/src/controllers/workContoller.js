import WorkUpdate from "../models/workUpdateModel.js";
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