const mongoose = require("mongoose");

const TechnicianDetailsSchema = new mongoose.Schema({
    technicianId: { type: String, default: getRandomIntInclusive },
    username: { type: String, default: '' },
    fname: { type: String, default: "" },
    email: { type: String },
    phone: { type: String },
    emiratesId: { type: String, default: "" },
    passportno: { type: String, default: "" },
    userType: { type: String, default: 'Technician' },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    tickets: [{
        ticketId: { type: mongoose.Schema.Types.ObjectId },
        message: { type: String, default: "" },
        subject: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now }
    }],
    isActive: { type: Boolean, default: false },
    jobs: [{
        jobid: { type: String, default: getRandomJobIDInclusive },
        allotedAt: { type: Date, default: Date.now },
        jobstart: { type: Date, default: "" },
        jobend: { type: Date, default: "" },
        payment: { type: Number, required: true },
        work: { type: Object, default: {} },
        address: { type: String, default: "" },
    }],
    verificationDoc: {
        Passportdoc: { type: String, default: "" },
        EmiratesIDdoc: { type: String, default: "" },
        Photographdoc: { type: String, default: "" }
    },
    bankDetails: {
        Fullname: { type: String, default: "" },
        AccountNo: { type: String, default: "" },
        IBAN: { type: String, default: "" },
    },
    isverifiedtech: { type: Boolean, default: false },
    techdocumentstatus: { type: Boolean, default: false },
    availability: { type: Boolean, default: true },
    technicianrole: { type: String, default: "" },
    balance: { type: Number, default: 0 },
    totalearnings: { type: Number, default: 0 },
    withdrawalrequest: [{
        withdrawalamount: { type: String, default: 0 },
        withdrawalrequestdatetime: { type: Date, default: Date.now },
        withdrawalrequeststatus: { type: String, default: "inprogress" }, // In progress, Proceed, Declined
    }],
    withdrawalamount: [{
        withdrawalvalue: { type: String, default: 0 },
        withdrawalstatus: { type: String, default: "" },
        withdrawaldate: { type: String, default: "" },
        withdrawaltime: { type: String, default: "" },
    }],
    isOrganization: { type: Boolean, default: false },
    organizationId: { type: String, default: "" }
}, { collection: "TechnicianInfo" });


function getRandomIntInclusive() {
    const min = Math.ceil(100000);
    const max = Math.floor(999999);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function getRandomJobIDInclusive() {
    const min = Math.ceil(10000);
    const max = Math.floor(99999);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

module.exports = mongoose.model("TechnicianInfo", TechnicianDetailsSchema);

