const mongoose = require("mongoose");

const NotificationScehma = new mongoose.Schema(
    {
        user: String,
        notificationtype: String,
        notification: String,
        createdAt: { type: Date, default: Date.now },
    },
    {
        collection: "NotificationInfo",
    }
);

mongoose.model("NotificationInfo", NotificationScehma);