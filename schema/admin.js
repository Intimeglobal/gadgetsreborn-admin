const mongoose = require("mongoose");

const adminScehma = new mongoose.Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
    },
    {
        collection: "admin",
    }
);

mongoose.model("admin", adminScehma);