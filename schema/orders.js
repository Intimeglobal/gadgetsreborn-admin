const mongoose = require("mongoose");

const OrdersDetailsScehma = new mongoose.Schema(
    {
        userID: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        whatdoyouliketodo: { type: String, default: "none" },
        orderId: { type: String, required: true, default: getRandomIntInclusive() },
        orderprice: { type: Number, default: 0 },
        dueAmount: { type: Number, default: 0 },
        lastorderDate: { type: Date, default: Date.now },
        diagnosticsdate: { type: Date, default: Date.now },
        orderstatus: { type: String, default: "pending" }, //expired,completed
        deviceDetails: {
            imei: String,
            serialnumber: String,
            modal: String,
            color: String,
            memory: String,
            version: String,
            manufacture: String,
        },
        diagnosis: {
            carrier: String,
            grade: String,
            anumber: String,
            cyclecount: String,
            designcapacity: String,
            batteryhealth: String,
            fmip: String,
            mdm: String,
            blacklist: String,
            sim: String,
            wipedversion: String,
            wipedresult: String,
            osversion: String,
            operation: String,
            touch: String,
            earpiece: String,
            digitizer: String,
            frontcamera: String,
            rearcameraquality: String,
            simcard: String,
            lcd: String,
            proximity: String,
            wifi: String,
            telephotocameraquality: String,
            gps: String,
            frontvideorecording: String,
            loudspeaker: String,
            rearvideorecording: String,
            Accelerometer: String,
            devicevibration: String,
            bluetooth: String,
            gyroscope: String,
            powerbutton: String,
            brightness: String,
            rearmic: String,
            rearcamera: String,
            frontcameraquality: String,
            screenrotation: String,
            flash: String,
            volumedownbutton: String,
            flipswitch: String,
            buttommic: String,
            volumeupbutton: String,
            telephotocamera: String,
            faceid: String,
            buttons: String,
            fromtmic: String,
            baseband: String,
            battery: String,
            ambientlight: String,
            Grading: String,
            icloud: String,
            createdAt: {}
        },
        paymentDetails: [
            {
                transactionId: { type: String, default: "" },
                amount: { type: Number, default: 0 },
                paymentDate: { type: Date },
                cardName: { type: String, default: "" },
                cardNumber: { type: String, default: 0 },
                purpose: { type: String } //repair, warranty, diagnose
            }
        ],
        problemAfterDiagnose: {
            type: Object, default: {}
        },
        work: { type: Array, 'default': [] },
        pickupdrop: { type: String, default: "" },
        address: { type: Object, default: {} },
        technicianAllotted: { type: String, default: "" },
        pickupdate: { type: String, },
        pickuptime: { type: String, },
        diagnoseDone: { type: String, default: "pending" }
        // pending-> show payment page, 
        // inprogress-> device details, 
        // completed-> all orders
    },
    {
        collection: "OrdersInfo",
    }
);

function getRandomIntInclusive() {
    min = Math.ceil(100000);
    max = Math.floor(999999);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

mongoose.model("OrdersInfo", OrdersDetailsScehma);