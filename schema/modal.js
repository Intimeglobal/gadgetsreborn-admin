const mongoose = require("mongoose");
const { Schema } = mongoose;

const ModelDetailsScehma = new mongoose.Schema(
    {
        modelname: { type: String, required: true },
        series: { type: mongoose.Schema.Types.ObjectId, ref: 'SeriesInfo', required: true },
        brand: { type: mongoose.Schema.Types.ObjectId, ref: 'BrandInfo', required: true },
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeInfo', required: true }
    },
    {
        collection: "ModelInfo",
    }
);

const ModelInfo = mongoose.model("ModelInfo", ModelDetailsScehma);

module.exports = ModelInfo;