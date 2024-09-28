import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Item",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity can not be less then 1."],
                },
                color: {
                    type: String,
                    required: false,
                },
                size: {
                    type: String,
                    required: true,
                },
            },
        ],
        deliveryInfo: [
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
        ],
        total: {
            type: Number,
            required: true,
        },
        paymentId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "Not processed",
        },
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model("Order", orderSchema);