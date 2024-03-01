const mongoose = require("mongoose");

const WarrantyPlansScehma = new mongoose.Schema(
    {
        planname: { type: String, default: "" },
        tenure: { type: String, default: "" },
        planmetricamountpercentage: { type: String, default: "" },
        deductible: [
            {
                deductiblename: { type: String, default: "" },
                deductiblemetricamount: { type: String, default: "" },
            }
        ],
        applicableto: [
            {
                type: { type: String, default: "" },
                brand: { type: String, default: "" },
                series: { type: String, default: "" },
                modal: { type: String, default: "" },
                minamount: { type: String, default: "" },
                maxamount: { type: String, default: "" },
            }
        ]
    },
    {
        collection: "WarrantyPlans",
    }
);

mongoose.model("WarrantyPlans", WarrantyPlansScehma);