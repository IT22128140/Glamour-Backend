import express from "express";
import { PORT, MONGO_URI } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";

//Maneth
import itemsRoute from "./routes/itemsRoute.js";
import cartRoute from "./routes/cartRoute.js";
import cusItemsRoute from "./routes/cusItemsRoute.js";











//Sandithi
import reviewRoute from "./routes/reviewRoute.js";













//Ridmi
import deliveryInfoRoute from './routes/deliveryInfoRoute.js';













//Hiranya















const app = express();

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("Connection Successful!");
});



//Maneth
app.use("/items", itemsRoute);
app.use("/cart", cartRoute);
app.use("/cusItems", cusItemsRoute);











//Sandithi
app.use("/reviews", reviewRoute);













//Ridmi
app.use("/deliveryInfo", deliveryInfoRoute);












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