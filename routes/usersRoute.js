import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import { Measurement } from "../models/bodyMeasurementModel.js";

const router = express.Router();

// Route for creating a new user
router.post("/", async (request, response) => {
  try {
    // const { error } = validate(request.body);
    // if (error) {
    //     return response.status(400).send({ message: error.details[0].message });
    // }

    const user = await User.findOne({ email: request.body.email });
    if (user) {
      return response.status(409).send({ message: "User with given email already exists!" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(request.body.password, salt);

    const newUser = new User({ ...request.body, password: hashPassword });
    await newUser.save();

    return response.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: "Internal Server Error" });
  }
});


// Route for updating user details (email, phone number, and password)
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return response.status(404).send({ message: "User not found" });
    }

    if (request.body.firstName) {
      user.firstName = request.body.firstName;
    }

    if (request.body.lastName) {
      user.lastName = request.body.lastName;
    }

    // Check if the email is being updated, and if it's already taken
    if (request.body.email && request.body.email !== user.email) {
      const emailExists = await User.findOne({ email: request.body.email });
      if (emailExists) {
        return response.status(409).send({ message: "Email already in use" });
      }
    }

    // Update the email if provided
    if (request.body.email) {
      user.email = request.body.email;
    }

    // Update the phone number if provided
    if (request.body.phoneNumber) {
      user.phoneNumber = request.body.phoneNumber;
    }

    // Update the password if provided (and hash it)
    if (request.body.password) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(request.body.password, salt);
      user.password = hashedPassword;
    }

    // Save the updated user to the database
    await user.save();

    return response.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error.message);
    return response.status(500).send({ message: "Internal Server Error" });
  }
});



// Route for deleting a user by ID
router.delete("/:id", async (request, response) => {
  try {
    const user = await User.findByIdAndDelete(request.params.id);


    if (!user) {
      return response.status(404).send({ message: "User not found" });
    }

    const measurement = await Measurement.findOneAndDelete({ MeasurementID: user._id });

    if (!measurement) {
      console.log("No measurement found for this user.");
    } else {
      console.log("Measurement deleted successfully.");
    }

    return response.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
