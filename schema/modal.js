const mongoose = require("mongoose");

const ModelDetailsScehma = new mongoose.Schema(
    {
        modelname: String,
    },
    {
        collection: "ModelInfo",
    }
);

mongoose.model("ModelInfo", ModelDetailsScehma);