const mongoose = require("mongoose");

const ProductDetailsScehma = new mongoose.Schema(
    {
        modalname: String,
        productname: String,
        price: String,
        status: String,
        createdAt: { type: Date, default: Date.now },
    },
    {
        collection: "ProductInfo",
    }
);

mongoose.model("ProductInfo", ProductDetailsScehma);