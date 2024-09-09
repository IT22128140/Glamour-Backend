import mongoose from "mongoose";

const deliveryInfoSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
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
        address: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: false,
    }
);

export const DeliveryInfo = mongoose.model('DeliveryInfo',deliveryInfoSchema);