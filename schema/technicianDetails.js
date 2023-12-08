const mongoose = require("mongoose");

const TechnicianDetailsScehma = new mongoose.Schema(
    {
        technicianId: { type: String, default: getRandomIntInclusive() },
        fname: { type: String, default: "" },
        username: { type: String, default: "", },
        email: { type: String, unique: true },
        phone: { type: String, unique: true },
        userType: { type: String, default: 'Technician' },
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
        isActive: {
            type: Boolean,
            default: false,
        },
        jobs: [
            {
                jobid: { type: String, required: true },
                allotedAt: { type: Date, default: Date.now },
                jobstart: { type: Date, default: "" },
                jobend: { type: Date, default: "" },
                payment: { type: Number, required: true },
                work: { type: Array, required: true },
                address: { type: String, default: "" },
            }
        ],
        verificationDoc: {
            passport: { type: String, default: "" },
            eid: { type: String, default: "" },
            tradelicense: { type: String, default: "" },
            photo: { type: String, default: "" }
        },
        isverified: { type: Boolean, default: false },
        availability: { type: Boolean, default: true },
        technicianrole: { type: String, default: "" },
        balance: { type: Number, default: 0 },
        totalearnings: { type: Number, default: 0 },
        isOrganization: { type: Boolean, default: false },
        organizationId: { type: String }
    },
    {
        collection: "TechnicianInfo",
    }
);

function getRandomIntInclusive() {
    min = Math.ceil(100000);
    max = Math.floor(999999);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

mongoose.model("TechnicianInfo", TechnicianDetailsScehma);