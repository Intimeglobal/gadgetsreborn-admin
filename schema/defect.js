const mongoose = require("mongoose");
const { Schema } = mongoose;

const DefectDetailsScehma = new mongoose.Schema(
    {
        defectname: { type: String, required: true },
        model: { type: mongoose.Schema.Types.ObjectId, ref: 'ModelInfo', required: true },
        series: { type: mongoose.Schema.Types.ObjectId, ref: 'SeriesInfo', required: true },
        brand: { type: mongoose.Schema.Types.ObjectId, ref: 'BrandInfo', required: true },
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeInfo', required: true }
    },
    {
        collection: "DefectInfo",
    }
);

const DefectInfo = mongoose.model("DefectInfo", DefectDetailsScehma);

module.exports = DefectInfo;