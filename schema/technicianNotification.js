const mongoose = require("mongoose");

const TechnicianNotificationScehma = new mongoose.Schema(
    {
        user: { type: String, default: "" },
        notificationtype: { type: String, default: "" },
        notification: { type: String, default: "" },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    {
        collection: "TechnicianNotification",
    }
);

mongoose.model("TechnicianNotification", TechnicianNotificationScehma);