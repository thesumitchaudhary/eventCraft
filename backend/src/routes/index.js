import express from "express";
import mongoose from "mongoose";

// this is for the create protected route
import isLoggedin from "../Middleware/isLoggedin.js"
import authMiddleware from "../Middleware/authMiddleware.js"
import adminMiddelware from "../Middleware/adminMiddleware.js"

// import eventbook mail funtion
import { SendEventBookingMail } from "../helpers/sendMail.js"

// this is for import the collection file
import customerModel from "../models/customerModel.js";
import eventBookingModel from "../models/eventBookingModel.js";
import paymentModel from "../models/paymentModel.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("hey it's working fine");
})

// this is do direct operation in mongodb engine

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

// this is for manual operation using js

router.get("/my-booking", authMiddleware, async (req, res) => {
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

router.post("/createEvent", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const userFirstname = req.user.firstname;
        const userLastname = req.user.lastname;

        const { eventName, eventType, theme, eventDate, venue, guestCount, totalAmount } = req.body;
        const customer = await customerModel.findOne({ userId });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const eventBooked = await eventBookingModel.create({
            customerId: customer._id,
            eventName,
            eventType,
            theme,
            eventDate,
            venue,
            guestCount,
            totalAmount
        });

        await customerModel.updateOne(
            { _id: customer._id },
            { $push: { events: eventBooked._id } }
        );

        await SendEventBookingMail(
            req.user.email,
            req.user.firstname,
            req.user.lastname,
            eventBooked.eventType,
            eventBooked.theme,
            eventBooked.eventDate,
            eventBooked.guestCount,
            eventBooked.totalAmount,
            eventBooked.paymentStatus,
            eventBooked.bookingStatus
        )

        res.status(201).json({
            success: true,
            data: eventBooked
        });
    } catch (error) {
        res.status(500).json({ error: error.message, message: "Error" });
    }
});



// this is for payment

router.post("/payment", authMiddleware, async (req, res) => {
    try {
        const { bookingId, paymentAmount, cardDetails } = req.body;

        const booking = await eventBookingModel.findById(bookingId);
        if (!booking) {
            return res.status(400).json({ success: false, message: "bookingId is required" });
        }

        const amount = Number(String(paymentAmount).replace(/[^0-9.]/g, ""));
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Valid paymentAmount is required" });
        }

        const previousPayment = await paymentModel.aggregate([
            {
                $match: {
                    bookingId: new mongoose.Schema.Types.ObjectId(bookingId)
                }
            },
            {
                $group: {
                    _id: "$bookingId",
                    totalPaid: { $sum: "$paymentAmount" }
                }
            }
        ]);

        const aleardyPaid = previousPayment[0]?.totalPaid || 0;

        const currentPayment = Number(paymentAmount);

        const totalPaid = aleardyPaid + currentPayment;

        let paymentStatus = "partial";

        if (totalPaid >= booking.totalAmount) {
            paymentStatus = "paid"
        }

        const makePayment = await paymentModel.create({
            bookingId,
            paymentAmount: amount,
            cardDetails, // do not store raw card data in production
            status: "success",
        });

        await eventBookingModel.findByIdAndUpdate(bookingId, {
            paymentStatus: paymentStatus,
        });

        return res
            .status(201)
            .json({ success: true, message: "Payment Successful", data: makePayment });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})

export default router