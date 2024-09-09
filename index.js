import express from "express";
import { PORT, MONGO_URI } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";

//Maneth














//Sandithi














//Ridmi














//Hiranya
import bodyMeasurementRoute from './routes/bodyMeasurementRoute.js';














const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  console.log(req);
  return res.status(234).send("Connection Successful!");
});



//Maneth














//Sandithi














//Ridmi













//Hiranya
app.use('/measurements', bodyMeasurementRoute);














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