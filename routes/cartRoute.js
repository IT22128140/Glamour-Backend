import express from "express";
import { Cart } from "../models/cartModel.js";
import { Item } from "../models/itemsModel.js";
import { Order } from "../models/orderModel.js";

const router = express.Router();

//delete cart items
router.put("/:userId/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { userId } = request.params;

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      response.status(404).send({ message: "Cart not found." });
      return;
    }

    let result = await Cart.updateOne(
      { userId: userId },
      { $pull: { items: { _id: id } } }
    );

    if (!result.nModified) {
      return response.status(404).json({ message: "Item not found" });
    }
    return response.status(200).send({ message: "Cart updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//update quantity of item in cart
router.put("/minus/:userId/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { userId } = request.params;

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      response.status(404).send({ message: "Cart not found." });
      return;
    }

    let itemIndex = cart.items.findIndex((p) => p._id == id);

    if (itemIndex !== -1) {
      let productItem = cart.items[itemIndex];
      productItem.quantity = productItem.quantity - 1;
      cart.items[itemIndex] = productItem;
    } else {
      // Handle the case where the product is not found
      response.status(404).send({ message: "Product not found in cart." });
      return;
    }

    // Save the updated cart back to the database
    await cart.save();

    // Send a success response
    response.status(200).send({ message: "Quantity updated successfully." });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: "Internal Server Error." });
  }
});

//update quantity of item in cart
router.put("/plus/:userId/:id/:productId", async (request, response) => {
  try {
    const { id } = request.params;
    const { userId } = request.params;
    const { productId } = request.params;

    let cart = await Cart.findOne({ userId: userId });
    let item = await Item.findOne({ _id: productId });

    if (!item) {
      return response.status(400).send({
        message: "Item not found",
      });
    }
    if (!cart) {
      response.status(404).send({ message: "Cart not found." });
      return;
    }

    let itemIndex = cart.items.findIndex((p) => p._id == id);

    if(item.stock < cart.items[itemIndex].quantity + 1){
      return response.status(400).send({
        message: "Quantity not available",
      });
    }
    if(5 < cart.items[itemIndex].quantity + 1){
      return response.status(400).send({
        message: "You can only buy 5 items",
      });
    }

    if (itemIndex !== -1) {
      let productItem = cart.items[itemIndex];
      productItem.quantity = productItem.quantity + 1;
      cart.items[itemIndex] = productItem;
    } else {
      // Handle the case where the product is not found
      response.status(404).send({ message: "Product not found in cart." });
      return;
    }

    // Save the updated cart back to the database
    await cart.save();

    // Send a success response
    response.status(200).send({ message: "Quantity updated successfully." });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: "Internal Server Error." });
  }
});

//Add item to cart
router.post("/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const { product, quantity, color, size } = request.body;
    let cart = await Cart.findOne({ userId: userId });
    let item = await Item.findOne({ _id: product });

    if (!item) {
      return response.status(400).send({
        message: "Item not found",
      });
    }

    if (item.stock < quantity) {
      return response.status(400).send({
        message: "Quantity not available",
      });
    }
    //if cart exists for user
    if (cart) {
      let itemIndex = cart.items.findIndex(
        (p) => p.product == product && p.color == color && p.size == size
      );

      //product exists in the cart, update the quantity
      if (itemIndex > -1) {
        let productItem = cart.items[itemIndex];
        productItem.quantity = Number(productItem.quantity) + Number(quantity);
        cart.items[itemIndex] = productItem;
      } else {
        cart.items.push({ product, quantity, color, size });
      }
      cart = await cart.save();
      return response.status(201).send(cart);
    } else {
      //no cart for user, create new cart
      const newCart = await Cart.create({
        userId: userId,
        items: [{ product, quantity, color, size }],
      });
      return response.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//get cart for user
router.get("/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const cart = await Cart.findOne({ userId: userId }).populate(
      "items.product"
    );

    if (!cart) {
      return response.status(404).json({ message: "Cart not found" });
    }

    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const cartitemsWithPriceChanged = await Promise.all(
      cart.items.map(async (item) => {
        const sales = await Order.aggregate([
          { $unwind: "$products" },
          {
            $match: {
              "products.productId": item.product.productId,
              createdAt: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: "$products.productId",
              totalQuantity: { $sum: "$products.quantity" },
            },
          },
        ]);

        const totalQuantity = sales.length > 0 ? sales[0].totalQuantity : 0;
        const priceChanged =
          item.product.priceincrease *
          (totalQuantity / item.product.salesdifference);
        const price = item.product.minprice + priceChanged;
        if (price > item.product.maxprice) {
          item.product.minprice = item.product.maxprice;
        } else {
          item.product.minprice = price;
        }
        return item;
      })
    );

    return response.status(200).json(cartitemsWithPriceChanged);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete all items in the cart for a given user
router.delete('/:userId', async (req, res) => {
  try {
      const { userId } = req.params;

      // Find the cart for the user
      let cart = await Cart.findOne({ userId: userId });

      if (!cart) {
          return res.status(404).send({ message: 'Cart not found.' });
      }

      // Clear all items from the cart
      cart.items = [];
      await cart.save();

      return res.status(200).send({ message: 'Cart cleared successfully.' });
  } catch (error) {
      console.log('Error clearing the cart: ', error);
      return res.status(500).send({ message: 'Internal server error.' });
  }
});

export default router;
