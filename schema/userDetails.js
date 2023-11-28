const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema(
    {
        userId: { type: String, default: getRandomIntInclusive() },
        fname: { type: String, default: "" },
        username: { type: String, default: "" },
        email: { type: String, unique: true },
        phone: { type: String, unique: true },
        userType: { type: String, default: 'User' },
        password: { type: String, required: true },
        image: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
        instagram: { type: String, default: "" },
        facebook: { type: String, default: "" },
        tickets: [
            {
                ticketId: { type: mongoose.Schema.Types.ObjectId },
                message: { type: String, default: "" },
                subject: { type: String, default: "" },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        addresses: [
            {
                name: { type: String, default: "" },
                phone: { type: String, default: "" },
                city: { type: String, default: "" },
                country: { type: String, default: "" },
                houseno: { type: String, default: "" },
                streetaddress: { type: String, default: "" },
                landmark: { type: String, default: "" },
                type: { type: String, default: "" },
            }
        ],
        currentOrderId: { type: String, default: "" },
        currentBalance: { type: Number, default: 0 }
    },
    {
        collection: "UserInfo",
    }
);

function getRandomIntInclusive() {
    min = Math.ceil(100000);
    max = Math.floor(999999);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

mongoose.model("UserInfo", UserDetailsSchema);