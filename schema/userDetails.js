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
        orderDetails: [
            {
                whatdoyouliketodo: { type: String, default: "none" },
                orderId: { type: String, default: "" },
                orderprice: { type: Number, default: 0 },
                dueAmount: { type: Number, default: 0 },
                lastorderDate: { type: Date, default: Date.now },
                diagnosticsdate: { type: Date, default: Date.now },
                orderstatus: String,
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
                        cardNumber: { type: String, default: 0 }
                    }
                ],
                work: { type: Array, 'default': [] },
                address: { type: String, default: "" },
                technicianAllotted: { type: String, default: "" }
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