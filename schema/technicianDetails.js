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
                jobid: { type: String, default: getRandomJobIDInclusive() },
                allotedAt: { type: Date, default: Date.now },
                jobstart: { type: Date, default: "" },
                jobend: { type: Date, default: "" },
                payment: { type: Number, required: true },
                work: { type: Object, default: {} },
                address: { type: String, default: "" },
            }
        ],
        verificationDoc: {
            Passport: { type: String, default: "" },
            EmiratesID: { type: String, default: "" },
            TradeLicence: { type: String, default: "" },
            Photograph: { type: String, default: "" }
        },
        bankDetails: {
            Fullname: { type: String, default: "", required: true },
            AccountNo: { type: String, default: "", required: true },
            IBAN: { type: String, default: "", required: true },
        },
        isverified: { type: Boolean, default: false },
        availability: { type: Boolean, default: true },
        technicianrole: { type: String, default: "" },
        balance: { type: Number, default: 0 },
        totalearnings: { type: Number, default: 0 },
        withdrawalrequest: [
            {
                withdrawalamount: { type: String, default: 0 },
                withdrawalrequestdatetime: { type: Date, default: Date.now },
                withdrawalrequeststatus: { type: String, default: "inprogress" }, // In progress, Proceed, Declined
            }
        ],
        withdrawalamount: [
            {
                withdrawalvalue: { type: String, default: 0 },
                withdrawalstatus: { type: String, default: "" },
                withdrawaldate: { type: String, default: "" },
                withdrawaltime: { type: String, default: "" },
            }
        ],
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

function getRandomJobIDInclusive() {
    min = Math.ceil(10000);
    max = Math.floor(99999);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

getRandomJobIDInclusive

mongoose.model("TechnicianInfo", TechnicianDetailsScehma);