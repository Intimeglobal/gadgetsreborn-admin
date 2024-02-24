const mongoose = require("mongoose");

const TypeDetailsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }
    },
    {
        collection: "TypeInfo"
    }
);

const TypeInfo = mongoose.model("TypeInfo", TypeDetailsSchema);

module.exports = TypeInfo;