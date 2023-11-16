const mongoose = require("mongoose");

const WarrantyDetailsScehma = new mongoose.Schema(
    {
        warrantyname: String,
        warrantyprice: Number,
    },
    {
        collection: "WarrantyInfo",
    }
);

mongoose.model("WarrantyInfo", WarrantyDetailsScehma);