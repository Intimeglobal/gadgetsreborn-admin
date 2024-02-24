// BrandInfo Schema
const mongoose = require("mongoose");

const BrandDetailsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeInfo', required: true }
    },
    {
        collection: "BrandInfo"
    }
);

const BrandInfo = mongoose.model("BrandInfo", BrandDetailsSchema);

module.exports = BrandInfo;
