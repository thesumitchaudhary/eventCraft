import express from "express";
import mongoose from "mongoose";

// this is for the create protected route
import authMiddleware from "../Middleware/authMiddleware.js"
import adminMiddelware from "../Middleware/adminMiddleware.js"
import customerMiddelware from "../Middleware/userMiddleware.js"

// import eventbook mail funtion
import { SendEventBookingMail } from "../helpers/sendMail.js"

// this is for import the collection file
import customerModel from "../models/customerModel.js";
import eventBookingModel from "../models/eventBookingModel.js";
import paymentModel from "../models/paymentModel.js";
import Ticket from "../models/ticketModel.js";

// this is for payment controller
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentController.js"
import { createEvent } from "../controllers/eventBookController.js"

const router = express.Router();

router.get("/", (req, res) => {
    res.send("hey it's working fine");
})



// this is do direct operation in mongodb engine this  is also for customer side

// router.get("/my-booking", authMiddleware, async (req, res) => {
//   try {

//     const userId = req.user.id;

//     const result = await customerModel.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(userId)
//         }
//       },

//       // join events
//       {
//         $lookup: {
//           from: "eventbookings", 
//           localField: "events",
//           foreignField: "_id",
//           as: "events"
//         }
//       },

//       // unwind events
//       {
//         $unwind: "$events"
//       },

//       // join payments
//       {
//         $lookup: {
//           from: "payments",
//           localField: "events._id",
//           foreignField: "bookingId",
//           as: "payments"
//         }
//       },

//       // calculate total paid
//       {
//         $addFields: {
//           "events.totalPaid": { $sum: "$payments.paymentAmount" }
//         }
//       },

//       // group back events
//       {
//         $group: {
//           _id: "$_id",
//           customerName: { $first: "$name" },
//           email: { $first: "$email" },
//           phone: { $first: "$phone" },
//           events: { $push: "$events" }
//         }
//       }

//     ]);

//     res.status(200).json({
//       success: true,
//       data: result
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// this is for manual operation using js. this is also for customer side

router.get("/my-booking", authMiddleware, customerMiddelware, async (req, res) => {
    try {
        const userId = req.user.id;

        const customer = await customerModel
            .findOne({ userId })
            .populate("events");

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const bookingIds = customer.events.map(event => event._id);

        const payments = await paymentModel.aggregate([
            {
                $match: {
                    bookingId: { $in: bookingIds }
                }
            },
            {
                $group: {
                    _id: "$bookingId",
                    totalPaid: { $sum: "$paymentAmount" }
                }
            }
        ]);

        // Convert payments array to lookup object
        const paymentMap = {};
        payments.forEach(p => {
            paymentMap[p._id.toString()] = p.totalPaid;
        });

        // Attach payment to events
        const eventsWithPayment = customer.events.map(event => ({
            ...event.toObject(),
            totalPaid: paymentMap[event._id.toString()] || 0
        }));

        res.status(200).json({
            success: true,
            customer: {
                name: customer.name,
                email: customer.email,
                phone: customer.phone
            },
            events: eventsWithPayment
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/createEvent", authMiddleware, customerMiddelware, createEvent);



// this is for payment

router.post("/payment/create-order", authMiddleware, createRazorpayOrder)
router.post("/payment/verify", authMiddleware, verifyRazorpayPayment)

router.get("/support-ticket", authMiddleware, async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        const normalizedRole = String(role || "")
            .trim()
            .toLowerCase();

        if (normalizedRole === "customer") {
            let ticket = await Ticket.findOne({
                customerId: userId,
                status: { $in: ["pending", "active", "escalated"] },
            }).sort({ createdAt: -1 });

            if (!ticket) {
                // Fallback to latest historical ticket so previous chat messages remain visible.
                ticket = await Ticket.findOne({
                    customerId: userId,
                }).sort({ updatedAt: -1 });
            }

            if (!ticket) {
                ticket = await Ticket.create({ customerId: userId });
            }

            return res.status(200).json({
                success: true,
                ticketId: ticket._id,
                status: ticket.status,
            });
        }

        if (normalizedRole === "employee" || normalizedRole === "staff") {
            let ticket = await Ticket.findOne({
                employeeId: userId,
                status: { $in: ["active", "escalated"] },
            }).sort({ updatedAt: -1 });

            if (!ticket) {
                ticket = await Ticket.findOne({
                    employeeId: null,
                    status: { $in: ["pending", "escalated", "active"] },
                }).sort({ createdAt: 1 });

                if (ticket) {
                    ticket.employeeId = userId;
                    if (ticket.status === "pending") {
                        ticket.status = "active";
                    }
                    await ticket.save();
                }
            }

            if (!ticket) {
                // Fallback to latest historical assigned ticket for old conversation visibility.
                ticket = await Ticket.findOne({
                    employeeId: userId,
                }).sort({ updatedAt: -1 });
            }

            if (!ticket) {
                // Final fallback: pick latest support ticket if one exists.
                // This prevents dead-end "no active ticket" states in small-team setups.
                ticket = await Ticket.findOne({
                    status: { $in: ["pending", "active", "escalated", "resolved"] },
                }).sort({ updatedAt: -1 });

                if (ticket && !ticket.employeeId) {
                    ticket.employeeId = userId;
                    if (ticket.status === "pending") {
                        ticket.status = "active";
                    }
                    await ticket.save();
                }
            }

            if (!ticket) {
                // Create a fallback ticket for employee-admin support so employee chat can start.
                ticket = await Ticket.create({
                    customerId: userId,
                    employeeId: userId,
                    status: "active",
                });
            }

            return res.status(200).json({
                success: true,
                ticketId: ticket._id,
                status: ticket.status,
            });
        }

        if (normalizedRole === "admin") {
            // Admin can open a ticket context too, useful for monitoring/responding.
            let ticket = await Ticket.findOne({
                status: { $in: ["pending", "active", "escalated", "resolved"] },
            }).sort({ updatedAt: -1 });

            if (!ticket) {
                ticket = await Ticket.create({
                    customerId: userId,
                    status: "active",
                });
            }

            return res.status(200).json({
                success: true,
                ticketId: ticket._id,
                status: ticket.status,
            });
        }

        return res.status(403).json({
            success: false,
            message: `Unsupported role for support ticket: ${normalizedRole || "unknown"}`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get("/messages/:ticketId", async (req, res) => {
    try {
        const { ticketId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(ticketId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ticketId",
                data: [],
            });
        }

        const messages = await Message.find({
            ticketId
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            data: [],
        });
    }
});

export default router