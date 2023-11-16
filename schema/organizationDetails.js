const mongoose = require("mongoose");

const organizationDetailsScehma = new mongoose.Schema(
    {
        name: { type: String, default: "" },
        tradelicense: { type: String, default: "" },
        owneremiratesId: { type: String, default: "" },
        ownerPhoto: { type: String, default: "" },
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

mongoose.model("OrganizationDetails", organizationDetailsScehma);