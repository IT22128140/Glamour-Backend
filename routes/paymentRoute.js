import express from "express";
import { Payment } from "../models/paymentModel.js";

const router = express.Router();

//Route for add payment
router.post("/", async (request, response) => {
    try {
        if (
            !request.body.firstName ||
            !request.body.lastName ||
            !request.body.contact ||
            !request.body.email ||
            !request.body.bank ||
            !request.body.branch ||
            !request.body.slip
        ) {
            return response.status(400).send({ message: "All fields are required" });
        }
        const newPayment = {
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            contact: request.body.contact,
            email: request.body.email,
            bank: request.body.bank,
            branch: request.body.branch,
            slip: request.body.slip,
        };

        const payment = await Payment.create(newPayment);

        return response.status(201).send(payment);
    }catch(error) {
        console.log(error.message);
        response.status(500).send({ message: error.message});
    }
});

//Route for get payment
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const payment = await Payment.findById(id);

        return response.status(200).send(payment);
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;