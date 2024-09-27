import express from "express";
import { Payment } from "../models/paymentModel.js";
import nodemailer from "nodemailer";
import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream'; // Used for handling the PDF stream

const router = express.Router();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'glamouronline2024@gmail.com', // Your email address
        pass: 'pyfr rmim veud rcyg', // Your email password or app-specific password
    },
});

// Function to generate a PDF dynamically
const generatePaymentPDF = (paymentDetails) => {
    const doc = new PDFDocument();
    const stream = new PassThrough(); // Create a stream to hold the PDF content
    doc.pipe(stream);

    // Add content to the PDF
    doc.fontSize(20).text("Payment Receipt", { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${paymentDetails.firstName} ${paymentDetails.lastName}`);
    doc.text(`Contact: ${paymentDetails.contact}`);
    doc.text(`Email: ${paymentDetails.email}`);
    doc.text(`Bank: ${paymentDetails.bank}`);
    doc.text(`Branch: ${paymentDetails.branch}`);
    doc.text(`Branch: Rs.${paymentDetails.totalPay}.00`);
    doc.text(`Payment Slip:`);
    const base64Image = paymentDetails.slip.replace(/^data:image\/\w+;base64,/, '');  //remove prefix

    // Add the payment slip image (converted from base64)
    if (base64Image) {
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Add the image to the PDF
        doc.image(imageBuffer, {
            fit: [250, 300], // Set the size of the image
            align: 'center',
            valign: 'center',
        });

        doc.moveDown();
    }

    doc.text("Thank you for your payment!", { align: 'center' });
    doc.end();

    return stream;
};

// Function to send email with PDF attachment
const sendPaymentSuccessEmail = async (email, paymentDetails) => {
    const pdfStream = generatePaymentPDF(paymentDetails); // Generate PDF

    const mailOptions = {
        from: 'glamouronline2024@gmail.com', // Sender address
        to: email, // Receiver email address
        subject: 'Payment Confirmation',
        text: `Dear ${paymentDetails.firstName} ${paymentDetails.lastName}, your payment was successful!`,
        html: `<p>Dear <b>${paymentDetails.firstName} ${paymentDetails.lastName}</b>,</p>
               <p>Your payment of<b>${paymentDetails.totalPay}</b> for <b>${paymentDetails.bank}</b> was successful. We have received your payment slip.</p>
               <p>Thank you for your order!</p>`,
        attachments: [
            {
                filename: 'PaymentReceipt.pdf', // Name of the PDF file
                content: pdfStream, // PDF stream
                contentType: 'application/pdf'
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

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
            !request.body.totalPay ||
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
            totalPay: request.body.totalPay,
            slip: request.body.slip,
        };

        const payment = await Payment.create(newPayment);

        // Send email after successful payment creation
        await sendPaymentSuccessEmail(newPayment.email, newPayment);

        return response.status(201).send(payment);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

//Route for get payment
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;

        const payment = await Payment.findById(id);

        return response.status(200).send(payment);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;