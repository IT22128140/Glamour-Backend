import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    minprice: {
      type: Number,
      required: true,
    },
    maxprice: {
      type: Number,
      required: true,
    },
    salesdifference: {
      type: Number,
      required: true,
    },
    priceincrease: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    trending: {
      type: Boolean,
      required: true,
    },
    colors: [
      {
        type: String,
        required: false,
      },
    ],
    sizes: [
      {
        type: String,
        required: true,
      },
    ],
    reviews: [
      {
        userId: {
          type: String,
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        reviewComment: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Item = mongoose.model("Item", itemSchema);
