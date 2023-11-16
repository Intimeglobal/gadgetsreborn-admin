const mongoose = require("mongoose");

const NotificationScehma = new mongoose.Schema(
    {
        user: String,
        notificationtype: String,
        notification: String,
    },
    {
        collection: "NotificationInfo",
    }
);

mongoose.model("NotificationInfo", NotificationScehma);