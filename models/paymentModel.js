import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        contact: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        bank: {
            type: String,
            required: true,
        },
        branch: {
            type: String,
            required: true,
        },
        slip: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = mongoose.model('Payment',paymentSchema);