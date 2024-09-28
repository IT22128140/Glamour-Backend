import express from "express";
import { Order } from "../models/orderModel.js";

const router = express.Router();

//Route to get all ongoing orders
router.get("/ongoing", async (request, response) => {
    try {
        const orders = await Order.find({
            status: { $nin: ["Delivered", "Canceled"] },  //neither "Delivered" nor "Cancelled"
        });
        return response.status(200).json(orders);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route to get all completed orders
router.get("/completed", async (request, response) => {
    try {
        const orders = await Order.find({
            $or: [{ status: "Delivered" }, { status: "Canceled" }],  //either "Delivered" or "Cancelled"
        });
        return response.status(200).json(orders);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for add order
router.post("/", async (request, response) => {
    try {
        if (
            !request.body.userId ||
            !request.body.products ||
            !request.body.deliveryInfo || 
            !request.body.total ||
            !request.body.paymentId
        ) {
            return response.status(400).send({ message: "All fields are required" });
        }

        // Create a new order
        const newOrder = {
            userId: request.body.userId,
            products: request.body.products.map(product => ({
                product: product.product, 
                quantity: product.quantity,
                color: product.color,
                size: product.size,
            })),
            deliveryInfo: request.body.deliveryInfo,
            total: request.body.total,
            paymentId: request.body.paymentId,
        };

        const order = await Order.create(newOrder);
        return response.status(201).send(order);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for get order
router.get('/:userId', async (request, response) => {
    try {
        const { userId } = request.params;

        const order = await Order.find({ userId: userId });

        return response.status(200).send(order);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for update order
router.put('/:id', async (request, response) => {
    try {
        const { userId } = request.params;

        const result = await Order.findByIdAndUpdate(userId, request.body);

        if (!result) {
            return response.status(400).send({ message: "Order not found" });
        }
        return response.status(200).send({ message: "Order updated successfully" });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;