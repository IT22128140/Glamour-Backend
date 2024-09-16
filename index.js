import express from "express";
import { PORT, MONGO_URI } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";

//Maneth
import itemsRoute from "./routes/itemsRoute.js";
import cartRoute from "./routes/cartRoute.js";












//Sandithi














//Ridmi
import deliveryInfoRoute from './routes/deliveryInfoRoute.js';
import orderRoute from './routes/orderRoute.js';
import paymentRoute from './routes/paymentRoute.js';











//Hiranya















const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("Connection Successful!");
});



//Maneth
app.use("/items", itemsRoute);
app.use("/cart", cartRoute);












//Sandithi














//Ridmi
app.use("/deliveryInfo", deliveryInfoRoute);
app.use("/orders", orderRoute);
app.use("/payment", paymentRoute);










//Hiranya















mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });