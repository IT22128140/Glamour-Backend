import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
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
  },
  {
    timestamps: false,
  }
);

const validateCart = async (cart) => {
  for (let item of cart.items) {
    const product = await Item.findById(item.product);
    if (!product) return false;
    if (product.stock < item.quantity) return false;
  }
  return true;
}

export const Cart = mongoose.model("Cart", cartSchema);
