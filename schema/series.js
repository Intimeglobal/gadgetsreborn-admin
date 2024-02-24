// SeriesInfo Schema
const mongoose = require("mongoose");

const SeriesDetailsScehma = new mongoose.Schema(
    {
        seriesname: { type: String, required: true },
        brand: { type: mongoose.Schema.Types.ObjectId, ref: 'BrandInfo', required: true },
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeInfo', required: true }
    },
    {
        collection: "SeriesInfo",
    }
);

const SeriesInfo = mongoose.model("SeriesInfo", SeriesDetailsScehma);

module.exports = SeriesInfo;