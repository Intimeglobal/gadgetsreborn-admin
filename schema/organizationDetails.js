const mongoose = require("mongoose");

const organizationDetailsScehma = new mongoose.Schema(
    {
        organizationId: { type: String, default: getRandomIntInclusive() },
        ownername: { type: String, default: "" },
        companyemail: { type: String, default: "" },
        phone: { type: String, default: "" },
        password: { type: String, required: true },
        companyname: { type: String, default: "" },
        tradelicenseno: { type: String, default: "" },
        region: { type: String, default: "" },
        tradelicenseexp: { type: String, default: "" },
        companyaddress: { type: String, default: "" },
        owneremiratesId: { type: String, default: "" },
        ownerpassportno: { type: String, default: "" },
        contactpersonname: { type: String, default: "" },
        contactpersonno: { type: String, default: "" },
        companylocation: { type: String, default: "" },
        isverified: { type: Boolean, default: false },
        documentstatus: { type: Boolean, default: false },
        verificationDoc: {
            Passport: { type: String, default: "" },
            EmiratesID: { type: String, default: "" },
            TradeLicence: { type: String, default: "" },
            Photograph: { type: String, default: "" }
        },
        technician: [
            {
                technicianId: { type: String, default: "" }
            }
        ],
        createdAt: { type: Date, default: Date.now },
    },
    {
        collection: "OrganizationDetails",
    }
);

function getRandomIntInclusive() {
    min = Math.ceil(100000);
    max = Math.floor(999999);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

mongoose.model("OrganizationDetails", organizationDetailsScehma);