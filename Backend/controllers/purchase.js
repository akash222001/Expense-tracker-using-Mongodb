const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/user'); // Assuming there's a User model
const userController = require('./user');

const purchasepremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const amount = 2500; // Amount in paise (₹25)

        // Create Razorpay order
        const order = await rzp.orders.create({
            amount,
            currency: "INR",
        });

        // Save order details to the database
        const newOrder = new Order({
            orderid: order.id,
            status: 'PENDING',
            userId: req.user._id, // Ensure this matches your schema field
        });

        await newOrder.save();

        return res.status(201).json({
            order,
            key_id: rzp.key_id,
        });
    } catch (err) {
        console.error(err);
        return res.status(403).json({
            message: 'Something went wrong',
            error: err.message,
        });
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;

        if (!payment_id || !order_id) {
            return res.status(400).json({
                message: "Invalid request. Payment ID and Order ID are required.",
            });
        }

        const order = await Order.findOne({ orderid: order_id });

        if (!order) {
            return res.status(404).json({
                message: "Order not found.",
            });
        }

        // Update order and user status
        await Promise.all([
            Order.updateOne(
                { orderid: order_id },
                { $set: { paymentid: payment_id, status: 'SUCCESSFUL' } }
            ),
            User.updateOne(
                { _id: req.user._id },
                { $set: { ispremiumuser: true } }
            ),
        ]);

        // Generate a new token for premium status
        const token = userController.generateAccessToken(req.user._id, undefined, true);

        return res.status(202).json({
            success: true,
            message: "Transaction successful",
            token,
        });
    } catch (err) {
        console.error(err);
        return res.status(403).json({
            message: 'Something went wrong',
            error: err.message,
        });
    }
};

module.exports = {
    purchasepremium,
    updateTransactionStatus
}