const mongoose = require("mongoose");

const OrdersDetailsScehma = new mongoose.Schema(
    {
        ordernumber: String,
        ordername: String,
        orderphone: String,
        orderemail: String,
        orderstatus: String,
        orderimei: String,
        orderserialnumber: String,
        ordermodel: String,
        ordercolor: String,
        ordermemory: String,
        orderproblems: Array,
        ordertestingscore: String,
        ordertechnician: String,
        orderjobstart: String,
        orderjobend: String,
        orderwarrantystatus: String,
        orderwarrantydata: String,
        orderwarrantyexpirydata: String,
        orderaddress: Array,
        createdAt: { type: Date, default: Date.now },
    },
    {
        collection: "OrdersInfo",
    }
);

mongoose.model("OrdersInfo", OrdersDetailsScehma);