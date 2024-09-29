import express from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// router.post('/auth', async (req, res) => {
// 	const token = req.body.token
// 	if (!token) {
// 		return res.json({ status: false })
// 	}
// 	jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
// 		if (err) {
// 			return res.json({ status: false })
// 		} else {
// 			const user = await User.findById(data.id)
// 			if (user) return res.json({ status: true, user: user.username })
// 			else return res.json({ status: false })
// 		}
// 	}
// 	)
// });

router.post('/auth', async (req, res) => {
	const token = req.body.token;
	if (!token) {
	  return res.json({ status: false });
	}
  
	jwt.verify(token, process.env.JWTPRIVATEKEY, async (err, data) => {
	  if (err) {
		return res.json({ status: false });
	  } else {
		const user = await User.findById(data._id);  // Use data._id if you set _id in the token payload
		if (user) {
		  return res.json({ status: true, userID: user._id });
		} else {
		  return res.json({ status: false });
		}
	  }
	});
  });

router.post("/", async (request, response) => {
	try {
		// const { error } = validate(request.body);
		// if (error) {
		// 	return response.status(400).send({ message: error.details[0].message });
		// }
		const user = await User.findOne({ email: request.body.email });
		if (!user) {
			return response.status(401).send({ message: "Invalid Email or Password" });
		}

		const validPassword = await bcrypt.compare(request.body.password, user.password);
		if (!validPassword) {
			return response.status(401).send({ message: "Invalid Email or Password" });
		}
		const token = user.generateAuthToken();
		return response.status(200).send({ token: token, message: "Logged in successfully" });
	} catch (error) {
		console.log(error.message);
		return response.status(500).send({ message: "Internal Server Error" });
	}
});

router.get('/:id', async (request, response) => {
    try {
      
      const id = request.params.id;
  
      const profileInfo = await User.findById(id);
  
      response.status(200).json(profileInfo);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Server Error' });
    }
  });

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

export default router;
