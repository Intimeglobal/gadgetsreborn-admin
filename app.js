const express = require("express");
const formidable = require('formidable');
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const bcrypt = require("bcryptjs");
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
const Mailgen = require('mailgen');
const twilio = require('twilio');
const apiKey = 'ba246ea6cefb8f2fc1a9026f8f3225d9';
const apiSecret = 'b85b078bc59fe94574ae18595f48fe0c';
var smsglobal = require('smsglobal')(apiKey, apiSecret);

const { uid } = require('uid');

const Stripe = require("stripe");
// const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;
// const SECRET_KEY = process.env.SECRET_KEY;

const PUBLISHABLE_KEY = "pk_test_51OKGfOGNhwRNzwdy9HbpM5bauKwi5S93JzW45rgnomufTicDrLtPF1h38gBn9j0lQkdLxZWismYIXq8d05MZEWn6004ItpBNae"
const SECRET_KEY = "sk_test_51OKGfOGNhwRNzwdyucIQkxvRHq1xS57rh5jeMOLj43GpUy3oaLceDZIGBJrt4EkamOsTw812NKf4fY0ztlzVjVSF00aGC60YiG"

const stripe = Stripe(SECRET_KEY, { apiVersion: "2023-10-16" });


// const stripe = require('stripe')("sk_test_51O8OqLKUlkWJEm6Xm5RFpMzVx1CUPMZfmuYs3PSGv2ogsGsGmeUlcVMbNy2CYMlnZ8UY9a4R2uSDzapP2fiH9JEY00yTdUptIK");

const monthlyDiagnose = "price_1OI7hYKUlkWJEm6XdPl4n2Mu";

let map = new Map([]);
// let map2 = new Map([]);



// path to .env file
dotenv.config({ path: path.join(__dirname, '.env') })

const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;
const fetchUser = require("./middleware/fetchUser");

const cors = require("cors");
const { restart } = require("nodemon");
const { type } = require("os");
// const { ConversationContextImpl } = require("twilio/lib/rest/conversations/v1/conversation");
app.use(cors());

// Database connection
const mongoUrl = process.env.URL;
mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Connected to database successfully");
    })
    .catch((e) => console.log(e));

// Schema Start 
require("./schema/userDetails");
require("./schema/technicianDetails");
require("./schema/orders");
require("./schema/warranty");
require("./schema/notification");
require("./schema/technicianNotification");
require("./schema/admin");
require("./schema/organizationDetails");
require("./schema/type");
require("./schema/brand");
require("./schema/series");
require("./schema/modal");
require("./schema/defect");
require("./schema/warrantyplans");


const User = mongoose.model("UserInfo");
const Technician = mongoose.model("TechnicianInfo");
const Company = mongoose.model("OrganizationDetails");
const Orders = mongoose.model("OrdersInfo");
const Warranty = mongoose.model("WarrantyInfo");
const Notification = mongoose.model("NotificationInfo");
const TechnicianNotification = mongoose.model("TechnicianNotification");
const Admin = mongoose.model("admin");

const Type = mongoose.model("TypeInfo");
const Mobilebrands = mongoose.model("BrandInfo");
const Series = mongoose.model("SeriesInfo");
const Models = mongoose.model("ModelInfo");
const Defect = mongoose.model("DefectInfo");
const WarrantyPlans = mongoose.model("WarrantyPlans");



// const accountSid = "AC76ab0a9ce0f377a72c7c1ca6dc8c432a"; Twillio mohit account
const accountSid = "AC8986006bf9c90316799f044073a62549";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// const servicesid = 'VA3072be8c6102f371a7fcd7ffdc7a2b46' - Twillio mohit account
const servicesid = 'VA382685147ee510eee7dbbc7f40a7af7c'
const aws = require('aws-sdk');
const fs = require('fs');

let fileName;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/'); // Adjust the destination folder
    },
    filename: (req, file, cb) => {
        fileName = Date.now() + '-' + file.originalname;
        cb(null, fileName); // Adjust the filename
    },
});

const upload = multer({ storage: storage });


// Configure AWS credentials
aws.config.update({
    accessKeyId: 'AKIAXRWWSULT4IGLATER',
    secretAccessKey: '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',
    region: 'us-east-1',
});


// function for send email verification 
const sendEmailVerification = async (recipientEmail) => {

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "MOHIT",
            link: "www.google.com",
        },
    });

    map.set(recipientEmail, Math.floor(Math.random() * 100000) + 100000);

    // creating the email template for it
    let Email = {
        body: {
            name: "Gadgetsreborn",
            intro: "Welcome to ! We' are excited to have you on board.",
            action: {
                instructions: "To confirm your email, please enter this code",
                button: {
                    color: "#22BC66",
                    text: map.get(recipientEmail),
                },
            },
            outro:
                "Need help, or have questions? jsut reply to this email, we'd love to help.",
        },
    };
    const emailBody = MailGenerator.generate(Email);
    const emailText = MailGenerator.generatePlaintext(Email);

    let message = {
        from: "mohit.seth389@gmail.com",
        to: recipientEmail,
        subject: "Authentication code for email verification",
        html: emailBody,
    };

    transporter.sendMail(message, function (error, info) {
        if (error) {
            console.log(error);
        }
    })
};

// function for change the OTP when OTP timeout is over
const OTPTIMEOUT = (email) => {
    setTimeout(() => {
        map.set(email, null);
        console.log("OTP Time out");
    }, 300000);
};

// End User Registration API
app.post("/register", async (req, res) => {
    const { fname, username, email, phone, userType, password, base64 } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldEmail = await User.findOne({ email });
        // const oldUsername = await User.findOne({ username });
        const oldPhone = await User.findOne({ phone });

        // image.create({ image: base64 }
        const user = await User.create({
            fname,
            username,
            email,
            phone,
            image: base64,
            password: encryptedPassword,
        });

        if (user) {
            res.status(200).json({ message: "user created", status: "ok" });
        } else {
            res.status(200).json({ message: "problem in creating the user", status: "ok" });
        }

    } catch (error) {
        res.send({ message: "error", error });
    }
});

// API for email verification
app.post('/email-verification', async (req, res) => {
    try {
        const { email } = req.body;

        // if any empty property remains
        if (!email) {
            return res
                .status(404)
                .json({ message: "Please fill the required field" });
        }
        // checking whether user exist
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            console.log("User Exist");
            return res.status(422).json({ message: "User Already Exist" });
        }
        await sendEmailVerification(email);

        // for time out of OTP after 60 seconds
        OTPTIMEOUT(email);
        res.status(200).json({ message: "OTP sent Successfully", status: "ok" });
    } catch (error) {
        console.log(error.message);
    }
})

app.post('/forgotpassword-email-verification', async (req, res) => {
    try {
        const { email } = req.body;

        // if any empty property remains
        if (!email) {
            return res
                .status(404)
                .json({ message: "Please fill the required field" });
        }
        // checking whether user exist
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            await sendEmailVerification(email);
            res.status(200).json({ message: "OTP sent Successfully", status: "ok" });
            OTPTIMEOUT(email);
        } else {
            res.status(422).json({ message: "User does not Exist" });
        }
        // for time out of OTP after 60 seconds
    } catch (error) {
        console.log(error.message);
    }
})

// for OTP verification
app.post('/otp-verification', async (req, res) => {
    const { otp, email } = req.body;
    try {
        console.log(otp, email);

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Check if the OTP is valid
        const storedOTP = map.get(email);
        if (storedOTP && (+otp) === storedOTP) {
            console.log("Verification done");
            res.status(200).json({ message: "Verification done", status: "ok" });
        } else {
            res.status(400).json({ message: "Wrong OTP" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// for forgotpassowrd verification
app.post('/forgotpassword-otp-verification', async (req, res) => {
    const { otp, email } = req.body;
    try {
        console.log(otp, email);

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const storedOTP = map.get(email);
            if (storedOTP && (+otp) === storedOTP) {
                console.log("Verification done");
                res.status(200).json({ message: "Verification done", status: "ok" });
            } else {
                res.status(400).json({ message: "Wrong OTP" });
            }
        } else {
            res.status(400).json({ message: "User does not exists" });
        }

        // Check if the OTP is valid

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post('/change-password', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!password || !email) {
            return res.status(400).json({ message: "please fill the required field" });
        }
        const currentUser = await User.findOne({ email: email });
        if (currentUser) {
            // generate salt to hash password
            const salt = await bcrypt.genSalt(10);
            // now we set user password to hashed password
            const newPassword = await bcrypt.hash(password, salt);
            const updatePassword = await User.findByIdAndUpdate(currentUser.id, {
                $set: {
                    'password': newPassword
                }
            });
            if (updatePassword) {
                res.status(200).json({ message: "Password Updated successfully", status: "ok" })
            } else {
                res.status(200).json({ message: "Something went wrong" })
            }
        } else {
            res.status(404).json({ message: "No user Found" });
        }
    } catch (error) {
        console.log(error)
    }
})

// sending otp using smsglobal
app.post('/mobile-otp', async (req, res) => {
    try {
        console.log("reached");
        const phonenumber = "+" + req.body.phone;

        const oldPhone = await User.findOne({ phone: req.body.phone });

        if (oldPhone) {
            return res.status(400).json({ message: "phone number already exist" });
        }

        const response = await client.verify.v2.services(servicesid)
            .verifications
            .create({ to: phonenumber, channel: 'sms' });
        console.log(response);
        if (response) {
            res.status(200).json({ message: "OTP sent successfully", status: "ok" })
        } else {
            res.status(500).json({ message: "Error sending mobile OTP", error: error.message });
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending mobile OTP", error: error.message });
    }
});

app.post('/otp-mobile-verification', async (req, res) => {
    try {
        // console.log("reached");
        const phonenumber = "+" + req.body.phone;
        const otp = req.body.otp;
        // const otp = Math.floor(Math.random() * 100000) + 100000;
        console.log(phonenumber);

        const response = await client.verify.v2.services(servicesid)
            .verificationChecks
            .create({ to: phonenumber, code: otp })

        if (response.status === "approved") {
            res.status(200).json({ message: response.status, status: "ok" });
        } else {
            res.status(200).json({ message: "OTP not match", status: "ok" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
})

// app.post('/mobile-email-verification', async (req, res) => {
//     try {
//         const { email } = req.body;

//         // if any empty property remains
//         if (!email) {
//             return res
//                 .status(404)
//                 .json({ message: "Please fill the required field" });
//         }
//         // checking whether user exist
//         const userExist = await User.findOne({ email: email });
//         if (!userExist)
//             return res.status(422).json({ message: "User does not Exist" });

//         await sendEmailVerification(email);

//         // for time out of OTP after 60 seconds
//         OTPTIMEOUT(email);
//         res.status(200).json({ message: "OTP sent Successfully", status: "ok" });
//     } catch (error) {
//         console.log(error.message);
//     }
// })

// API for checking the OTP
// app.post('/checking-otp', async (req, res) => {
//     const otp = req.body.otp;
//     const email = req.body.email;

//     if ((+otp) === map.get(email)) {
//         res.status(200).json({ message: "Email verfied successfully", verified: true });
//     } else {
//         res.status(404).json({ message: "OTP does not match", verified: false });
//     }
// })

// Login API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.send({ error: "User Not Found" });
    }
    if (await bcrypt.compare(password, user.password)) {

        const data = {
            user: {
                id: user._id,
            },
        };
        const token = jwt.sign(data, JWT_SECRET);
        const response = await Orders.findOne({ orderId: user.currentOrderId })
        console.log(response);
        res.status(200).json({ status: "ok", token: token, currentOrderId: user.currentOrderId, diagnoseDone: response });
    } else {
        res.json({ status: "error", message: "Invalid Password" });
    }
});


// Forgot-password API
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (!oldUser) {
            return res.json({ status: "User Not Exists!!" });
        }

        const secret = JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: '5m' });

        const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
        //email start
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        let MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Reset Password Email",
                link: link,
            }
        });

        let Email = {
            body: {
                name: "Anonymous",
                intro: "Welcome to Gadgets Reborn We\' are excited to have you on board.",
                action: {
                    instructions: 'To confirm your email, please enter this code',
                    button: {
                        color: '#22BC66',
                        text: 'Reset Password',
                        link: link,
                    }
                },
                outro: "Need help, or have questions? jsut reply to this email, we\'d love to help."
            }
        }
        const emailBody = MailGenerator.generate(Email);
        const emailText = MailGenerator.generatePlaintext(Email);


        let mailOptions = {
            from: "mohit.seth389@gmail.com",
            to: email,
            subject: "Password Reset",
            html: emailBody
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                // res.send({ status: "ok" });
            }
        })
    } catch (error) {
        res.send({ status: "Something went wrong try again" });
    }
});

//Reset Password API
app.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        res.render("index", { email: verify.email, status: "Not verified" });
    } catch (error) {
        res.send("Not Verified")
    }
});

//Reset Password API 
app.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
    }
    console.log(password);
    const secret = JWT_SECRET + oldUser.password;
    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcrypt.hash(password, 10);
        await User.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: encryptedPassword,
                },
            }
        );
        res.redirect("http://localhost:3000/login");
        res.render("index", { email: verify.email, status: "Verified" });
    } catch (error) {
        console.log(error);
        res.json({ status: "Something Went Wrong" });
    }
});

//users API
app.post("/users", async (req, res) => {
    const { token } = req.body;
    // console.log(token);
    try {
        const user = jwt.verify(token, JWT_SECRET, (err, res) => {
            if (err) {
                return "token expired";
            }
            return res;
        });
        // console.log(user);
        if (user == "token expired") {
            return res.send({ status: "error", data: "token expired" });
        }
        const useremail = user.email;
        Admin.findOne({ email: useremail })
            .then((data) => {
                res.send({ status: "ok", data: data })
            })
            .catch((error) => {
                res.send({ status: "error", data: data })
            });
    } catch (error) {

    }
});

//Fetch All Users Data
app.get("/getAllUser", async (req, res) => {
    try {
        const allUser = await User.find({});
        res.send({ status: "ok", data: allUser });
    } catch (error) {
        console.log(error);
    }
});

// Update User Data API
// app.post('/updateUser', upload('image'), async (req, res) => {
//     try {
//         const { _id, fname, address, role, instagram, facebook } = req.body;
//         let base64 = null;

//         if (req.file) {
//             // Convert the image to base64
//             base64 = req.file.buffer.toString('base64');
//         }

//         // Use Mongoose to update the user by _id
//         const updatedUser = await User.findByIdAndUpdate(_id, { fname, address, role, instagram, facebook, image: base64 }, { new: true });

//         if (!updatedUser) {
//             // If user not found, return a 404 error
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // User updated successfully, send the updated user as a response
//         res.status(200).json({ message: 'User updated successfully', user: updatedUser });
//     } catch (error) {
//         // Handle any errors and send an error response
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Fetch Loggedin user by Data
app.post("/getloginuserdata", async (req, res) => {
    const { token } = req.body;

    try {
        const user = jwt.verify(token, JWT_SECRET);
        const useremail = user.email;
        User.findOne({ email: useremail })
            .then((data) => {
                if (data) {
                    res.status(200).send({ status: "ok", data: data });
                } else {
                    res.status(404).send({ status: "error", message: "User not found" });
                }
            })
            .catch((error) => {
                res.status(500).send({ status: "error", message: "Internal server error" });
                console.error(error);
            });
    } catch (error) {
        res.status(401).send({ status: "error", message: "Invalid or expired token" });
    }
});

// API For Paginated Users
app.get("/paginatedUsers", async (req, res) => {
    const allUser = await User.find({});
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const lastIndex = (page) * limit

    const results = {}
    results.totalUser = allUser.length;
    results.pageCount = Math.ceil(allUser.length / limit);

    if (lastIndex < allUser.length) {
        results.next = {
            page: page + 1,
        }
    }
    if (startIndex > 0) {
        results.prev = {
            page: page - 1,
        }
    }

    results.result = allUser.slice(startIndex, lastIndex);

    res.json(results)
})

// Modal Added API
// app.post("/modal-added", async (req, res) => {
//     const { modelname } = req.body;
//     try {
//         const oldModel = await Models.findOne({ modelname });
//         if (oldModel) {
//             return res.json({ error: "Model Already Exists" });
//         }
//         await Models.create({
//             modelname,
//         });
//         res.send({ status: "ok" });
//     } catch (error) {
//         res.send({ status: "error", error });
//     }
// });

// Get All Models API
// app.get("/models", async (req, res) => {
//     try {
//         const allModels = await Models.find({});
//         res.send({ status: "ok", data: allModels });
//     } catch (error) {
//         console.log(error);
//     }
// });

// Delete Model From Database API
// app.delete("/models/:id", async (req, res) => {
//     const id = req.params.id;
//     try {
//         const deleteModel = await Models.findByIdAndDelete({ _id: id });
//         if (!req.params.id) {
//             return res.status(400).send();
//         }
//         res.send(deleteModel);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// API For Paginated Technicians
// app.get("/paginatedModel", async (req, res) => {
//     const allUser = await Models.find({});
//     const page = parseInt(req.query.page)
//     const limit = parseInt(req.query.limit)

//     const startIndex = (page - 1) * limit
//     const lastIndex = (page) * limit

//     const results = {}
//     results.totalUser = allUser.length;
//     results.pageCount = Math.ceil(allUser.length / limit);

//     if (lastIndex < allUser.length) {
//         results.next = {
//             page: page + 1,
//         }
//     }
//     if (startIndex > 0) {
//         results.prev = {
//             page: page - 1,
//         }
//     }

//     results.result = allUser.slice(startIndex, lastIndex);

//     res.json(results)
// })

// Product Added API
// app.post("/product-added", async (req, res) => {
//     const { modalname, productname, price, status } = req.body;
//     try {
//         await Products.create({
//             modalname,
//             productname,
//             price,
//             status,
//         });
//         res.send({ status: "ok" });
//     } catch (error) {
//         res.send({ status: "error", error });
//     }
// })

// Get All Product API
// app.get("/products", async (req, res) => {
//     try {
//         const allProducts = await Products.find({});
//         res.send({ status: "ok", data: allProducts });
//     } catch (error) {
//         console.log(error);
//     }
// });

// Update Products Data API
// app.post("/updateProducts", async (req, res) => {
//     try {
//         const { _id, price, status } = req.body;
//         // Use Mongoose to update the user by _id
//         const updatedData = await Products.findByIdAndUpdate(_id, { price, status }, { new: true });

//         if (!updatedData) {
//             // If user not found, return an error
//             return res.status(404).json({ error: "User not found" });
//         }

//         // User updated successfully, send the updated user as a response
//         res.status(200).json({ message: "Product updated successfully", user: updatedData });
//     } catch (error) {
//         // Handle any errors and send an error response
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// API For Paginated Products
// app.get("/paginatedProducts", async (req, res) => {
//     const allProducts = await Products.find({});
//     const page = parseInt(req.query.page)
//     const limit = parseInt(req.query.limit)

//     const startIndex = (page - 1) * limit
//     const lastIndex = (page) * limit

//     const results = {}
//     results.totalUser = allProducts.length;
//     results.pageCount = Math.ceil(allProducts.length / limit);

//     if (lastIndex < allProducts.length) {
//         results.next = {
//             page: page + 1,
//         }
//     }
//     if (startIndex > 0) {
//         results.prev = {
//             page: page - 1,
//         }
//     }

//     results.result = allProducts.slice(startIndex, lastIndex);

//     res.json(results)
// });

// Dashboard Palletes Total Number of users
app.get('/total-users', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.json({ totalUsers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error retrieving user count' });
    }
});

// Dashboard Palletes Total Number of Technicians
app.get('/total-technicians', async (req, res) => {
    try {
        const totalTechnicians = await Technician.countDocuments();
        res.json({ totalTechnicians });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error retrieving user count' });
    }
});

// Warranty API
app.post("/warranty-plans", async (req, res) => {
    try {
        const { planname, tenure, planmetricamountpercentage, deductible, applicableto } = req.body;

        // Create a new warranty plan document
        const warrantyPlan = new WarrantyPlans({
            planname,
            tenure,
            planmetricamountpercentage,
            deductible,
            applicableto,
        });

        // Save the document to the database
        await warrantyPlan.save();

        res.status(201).json({ message: "Warranty plan created successfully", warrantyPlan });
    } catch (error) {
        console.error("Error creating warranty plan:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.get("/getwarrantydata", async (req, res) => {
    try {
        const allWarranty = await Warranty.find({});
        res.send({ status: "ok", data: allWarranty });
    } catch (error) {
        console.log(error);
    }
})

// Notification added 
app.post("/notifications-added", async (req, res) => {
    const { user, notificationtype, notification } = req.body;
    try {
        await Notification.create({
            user,
            notificationtype,
            notification
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error", error });
    }
})

// Notification Get API
app.get("/allnotifications", async (req, res) => {
    try {
        const allNotifications = await Notification.find({});
        res.send({ status: "ok", data: allNotifications });
    } catch (error) {
        console.log(error);
    }
})


// creating the user order details byupdating the user details
app.post('/create-order', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const wdyltd = req.body.wdyltd;
        let orderId = uid();
        const userExist = await User.findOne({ _id: userID }, { password: 0 });
        // res.send(userExist);
        if (userExist) {
            const orderdetails = {
                whatdoyouliketodo: wdyltd,
                orderId: orderId,
                email: userExist.email,
                phone: userExist.phone,
                userID: userExist.id,
            }

            const data = await Orders.create(
                orderdetails,
            )
            if (data) {

                await User.findByIdAndUpdate(
                    userExist.id,
                    {
                        '$set': {
                            'currentOrderId': orderId
                        }
                    }
                )
                res.status(200).json({ message: "order generated successfully", status: "ok" })
            } else {

            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }

});

// creating the stripe payment integration 
app.get('/diagnos-payment', async (req, res) => {
    // const userID = req.user.id;
    try {
        // const userExist = await User.findOne({ _id: userID }, { password: 0, _id: 0 });
        // res.send(userExist);
        userExist = true;
        if (userExist) {
            // 
            const paymentIntent = await stripe.paymentIntents.create({
                amount: 1000,
                currency: 'usd',
                payment_method_types: ['card'],
                payment_method: 'pm_card_visa',
                confirm: true,
                capture_method: 'manual',
                expand: ['latest_charge'],
                payment_method_options: {
                    card: {
                        request_multicapture: 'if_available',
                    },
                },
            });
            // const amount = (2000 * 0.3);
            // console.log(amount);
            // const intent = await stripe.paymentIntents.capture(paymentIntent.id, {
            //     amount_to_capture: amount,
            // })

            if (paymentIntent) {
                res.status(200).json({ paymentInfo: paymentIntent })
            } else {
                res.status(200).json({ message: "something went wrong" })
            }

        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

// creating the stripe payment integration 
app.post('/catpure-payment', fetchUser, async (req, res) => {
    const userID = req.user.id;
    const pid = req.body.pid;
    try {
        const userExist = await User.findOne({ _id: userID }, { password: 0, _id: 0 });
        // res.send(userExist);
        if (userExist) {
            // 
            // const amount = (2000 * 0.3);
            // console.log(amount);
            // const intent = await stripe.paymentIntents.capture(pid, {
            //     amount_to_capture: amount,
            // })

            const intent = await stripe.paymentIntents.cancel(pid);

            if (intent) {
                res.status(200).json({ paymentInfo: intent })
            } else {
                res.status(200).json({ message: "something went wrong" })
            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

// Pick Up / Drop Select 
app.post('/pickdrop', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await User.findOne({ _id: userID }, { password: 0, _id: 0 })
        const pickdrop = req.body.pickdrop;


        if (userExist) {
            const orderID = userExist.currentOrderId;
            const response = await Orders.findOneAndUpdate({ orderId: orderID }, {
                '$set': {
                    'pickupdrop': pickdrop
                }
            })

            if (response) {
                res.status(200).json({ message: pickdrop, status: 'ok' })
            }

        } else {
            res.status(200).json({ message: "User does not Exist" });
        }
    } catch (error) {
        res.status(400).json({ message: "something went wrong" });
    }
})

// fetch all adresses
app.get('/get-addresses', fetchUser, async (req, res) => {

    try {
        const userID = req.user.id;
        const userExist = await User.findOne({ _id: userID }, { password: 0, _id: 0 });
        // res.send(userExist);
        if (userExist) {
            res.status(200).json({ data: userExist.addresses, status: "ok" });
        } else {
            res.status(400).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

// add the address in the userdetails
app.post('/add-address', fetchUser, async (req, res) => {
    try {
        console.log(req.body.address);
        const userID = req.user.id;
        const userExist = await User.findOne({ _id: userID }, { password: 0, _id: 0 });
        if (userExist) {
            const { name,
                phone,
                city,
                country,
                houseno,
                streetaddress,
                landmark,
                type, } = req.body.address;


            const address = {
                name: name,
                phone: phone,
                city: city,
                country: country,
                houseno: houseno,
                streetaddress: streetaddress,
                landmark: landmark,
                type: type,
            }

            const response = await User.findByIdAndUpdate(userID, {
                '$push': {
                    addresses: address
                }
            })

            if (response) {
                res.status(200).json({ message: "address added successfully", status: 'ok' })
            } else {
                res.status(200).json({ message: "something went wrong" })
            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

app.get('/user-details', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await User.findOne({ _id: userID }, { password: 0, _id: 0 });
        if (userExist) {
            res.status(200).json({ data: userExist, status: 'ok' })
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

// update the address in the current order
app.post('/add-order-address', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await User.findOne({ _id: userID }, { password: 0, _id: 0 });
        const address = req.body.address;

        if (!address) {
            return res.status(400).json({ message: "please select the address" });
        }

        if (userExist) {

            const response = await Orders.findOneAndUpdate({ orderId: userExist.currentOrderId }, {
                '$set': {
                    'address': address
                }
            })

            if (response) {
                res.status(200).json({ message: "address added successfully", status: "ok" })
            } else {
                res.status(200).json({ message: "something went wrong" })
            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

// updating the date and time in the order
app.post('/add-pickup-date', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await User.findOne({ _id: userID }, { password: 0, _id: 0 });
        const pickupdate = req.body.pickupdate;
        const pickuptime = req.body.pickuptime;

        if (!pickupdate || !pickuptime) {
            return res.status(400).json({ message: "please select the date and time" });
        }

        if (userExist) {

            const response = await Orders.findOneAndUpdate({ orderId: userExist.currentOrderId }, {
                '$set': {
                    'pickupdate': pickupdate,
                    'pickuptime': pickuptime
                }
            })

            if (response) {
                res.status(200).json({ message: "date and time added successfully", status: "ok", orderID: userExist.currentOrderId })
            } else {
                res.status(200).json({ message: "something went wrong" })
            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

// fetching the current order details
app.get('/current-order', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await User.findOne({ _id: userID }, { password: 0, _id: 0 });


        if (userExist) {

            const response = await Orders.findOne({ orderId: userExist.currentOrderId })
            console.log(response);
            if (response) {
                res.status(200).json({ data: response, status: "ok", })
            } else {
                res.status(200).json({ message: "something went wrong" })
            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

// fetch all the order of the user
app.get('/all-orders', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await User.findOne({ _id: userID }, { password: 0 });


        if (userExist) {
            // console.log(userExist.id);
            const response = await Orders.find({ userID: userExist.id })
            // console.log(response);
            if (response) {
                res.status(200).json({ data: response, status: "ok", })
            } else {
                res.status(200).json({ message: "something went wrong" })
            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

// fethcing the particular order
app.get('/fetch-order/:ID', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await User.findOne({ _id: userID }, { password: 0 });
        const orderID = req.params.ID;


        if (userExist) {
            // console.log(userExist.id);
            const response = await Orders.findOne({ orderId: orderID })
            // console.log(response);
            if (response) {
                res.status(200).json({ data: response, status: "ok", })
            } else {
                res.status(200).json({ message: "something went wrong" })
            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

// creating the susbcription for diagnosing monthly
app.get('/create-checkout-session', fetchUser, async (req, res) => {
    try {

        const userid = req.user.id;
        const user = await User.findOne({ _id: userid });

        if (user) {
            try {
                const session = await stripeSession(user.email);
                res.status(200).json({ data: session });
            } catch (error) {
                res.status(404).json({ message: "problem in creating the subscription" });
            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }
    } catch (error) {
        console.log(error);
    }
})

const stripeSession = async (email) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: monthlyDiagnose,
                    quantity: 1
                },
            ],
            // success_url: "newapp://PaymentSuccess",
            // cancel_url: "http://206.189.143.222:3000/cancel",
            customer_email: email,

        });
        return session;
    } catch (error) {
        return error;
    }
}


// Mohit Stripe Payment Function 

app.get('/create-payment-intent', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await User.findOne({ _id: userID }, { password: 0 });
        // const { amount } = req.body;

        if (userExist) {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: 1999,
                currency: 'aed',
            });
            console.log(userExist.email);
            res.status(200).json({ clientSecret: paymentIntent.client_secret });

        } else {
            res.status(400).json({ message: "User does not exist" })
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/get-diagnose-payment', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await User.findOne({ _id: userID }, { password: 0 });
        const paymentInfo = req.body.paymentInfo;

        console.log(paymentInfo)
        const currentObj = {
            transactionId: paymentInfo.id,
            amount: paymentInfo.amount,
            paymentDate: paymentInfo.created,
            cardName: paymentInfo.paymentMethod.Card.brand,
            cardNumber: paymentInfo.paymentMethod.Card.last4
        }

        const response = await Orders.findOneAndUpdate({ orderId: userExist.currentOrderId }, {
            '$push': {
                paymentDetails: currentObj
            },
            '$set': {
                diagnoseDone: "inprogress",
                orderstatus: "inprogress"
            }
        })

        if (response) {

            res.status(200).json({ message: "Payment Successful", status: "ok" });

        } else {
            res.status(400).json({ message: "User does not exist" })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



///////////////////// Technicians App ///////////////////////////

// creating the Company details
app.post('/create-order', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const wdyltd = req.body.wdyltd;
        let orderId = uid();
        const userExist = await User.findOne({ _id: userID }, { password: 0 });
        // res.send(userExist);
        if (userExist) {
            const orderdetails = {
                whatdoyouliketodo: wdyltd,
                email: userExist.email,
                phone: userExist.phone,
                userID: userExist.id,
            }

            const data = await Orders.create(
                orderdetails,
            )
            if (data) {

                await User.findByIdAndUpdate(
                    userExist.id,
                    {
                        '$set': {
                            'currentOrderId': orderId
                        }
                    }
                )
                res.status(200).json({ message: "order generated successfully", status: "ok" })
            } else {

            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }

});


//////////////////////////////////////////// Register Company ////////////////////////////////////////

// Technician Register API
app.post("/company-register", async (req, res) => {
    const { ownername, companyemail, phone, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    console.log(req.body);

    try {
        const user = await Company.create({
            ownername,
            companyemail,
            phone,
            password: encryptedPassword,
        });

        await user.save();

        if (user) {
            res.status(200).json({ message: "Company Registered", status: "ok" });
        } else {
            res.status(200).json({ message: "Problem in creating the user", status: "ok" });
        }

    } catch (error) {
        res.send({ message: "error", error });
    }
});

app.post('/company-email-verification', async (req, res) => {
    try {
        const { companyemail } = req.body;

        // if any empty property remains
        if (!companyemail) {
            return res
                .status(404)
                .json({ message: "Please fill the required field" });
        }
        // checking whether user exist
        const userExist = await Company.findOne({ companyemail: companyemail });
        if (userExist) {
            console.log("Company Exist");
            return res.status(422).json({ message: "Company Already Exist" });
        }
        await sendEmailVerification(companyemail);

        // for time out of OTP after 60 seconds
        OTPTIMEOUT(companyemail);
        res.status(200).json({ message: "OTP sent Successfully", status: "ok" });
    } catch (error) {
        console.log(error.message);
    }
})

// for OTP verification
app.post('/company-otp-verification', async (req, res) => {
    const { otp, companyemail } = req.body;
    try {
        console.log(otp, companyemail);

        // Check if the email already exists
        const existingUser = await Company.findOne({ companyemail });
        if (existingUser) {
            return res.status(400).json({ message: "Company already exists" });
        }

        // Check if the OTP is valid
        const storedOTP = map.get(companyemail);
        if (storedOTP && (+otp) === storedOTP) {
            console.log("Verification done");
            res.status(200).json({ message: "Verification done", status: "ok" });
        } else {
            res.status(400).json({ message: "Wrong OTP" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// sending otp using smsglobal
app.post('/company-mobile-otp', async (req, res) => {
    try {
        console.log("reached");
        const phonenumber = req.body.phone;

        const oldPhone = await Company.findOne({ phone: req.body.phone });
        console.log(phonenumber);
        if (oldPhone) {
            return res.status(400).json({ message: "phone number already exist" });
        }

        const response = await client.verify.v2.services(servicesid)
            .verifications
            .create({ to: phonenumber, channel: 'sms' });
        console.log(response);
        if (response) {
            res.status(200).json({ message: "OTP sent successfully", status: "ok" })
        } else {
            res.status(500).json({ message: "Error sending mobile OTP", error: error.message });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending mobile OTP", error: error.message });
    }
});

// app.post('/company-mobile-otp', async (req, res) => {
//     try {
//         console.log("Reached");
//         const phoneNumber = req.body.phone;
//         const origin = ""; // Replace "YourSenderNumber" with your actual sender number or sender ID provided by SMSGlobal
//         console.log(origin);
//         const oldPhone = await Company.findOne({ phone: phoneNumber });
//         if (oldPhone) {
//             return res.status(400).json({ message: "Phone number already exists" });
//         }

//         const verificationCode = Math.floor(Math.random() * 900000) + 100000;
//         const message = `{*code*} is your OTP ${verificationCode}`; // Include the {*code*} placeholder

//         // Construct the payload for SMSGlobal
//         const payload = {
//             origin: origin,
//             message: message,
//             destination: phoneNumber
//         };

//         // Send OTP using SMSGlobal
//         smsglobal.otp.send(payload, function (error, response) {
//             if (response) {
//                 console.log(response);
//                 res.status(200).json({ message: "OTP sent successfully", status: "ok" });
//             } else {
//                 console.error("Error sending OTP:", error);
//                 if (error.data && error.data.errors) {
//                     console.error("API errors:", error.data.errors);
//                 }
//                 res.status(500).json({ message: "Error sending mobile OTP", error: error.message });
//             }
//         });

//     } catch (error) {
//         console.error("Error sending mobile OTP:", error);
//         res.status(500).json({ message: "Error sending mobile OTP", error: error.message });
//     }
// });






app.post('/company-otp-mobile-verification', async (req, res) => {
    try {
        // console.log("reached");
        const phonenumber = req.body.phone;
        const otp = req.body.otp;
        // const otp = ccccccccc
        console.log(phonenumber);

        const response = await client.verify.v2.services(servicesid)
            .verificationChecks
            .create({ to: phonenumber, code: otp })

        if (response.status === "approved") {
            res.status(200).json({ message: response.status, status: "ok" });
        } else {
            res.status(200).json({ message: "OTP not match", status: "ok" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
})


// Company-Login API

// app.post("/company-login", async (req, res) => {
//     const { phone, password } = req.body;

//     const user = await Company.findOne({ phone });

//     if (!user) {
//         return res.send({ error: "Company Not Found" });
//     }
//     if (await bcrypt.compare(password, user.password)) {

//         const data = {
//             user: {
//                 id: user._id,
//             },
//         };
//         const token = jwt.sign(data, JWT_SECRET);
//         // const response = await Orders.findOne({ orderId: user.currentOrderId })
//         const responseData = {
//             documentstatus: user.documentstatus,
//             isverified: user.isverified,
//             token: token,
//             status: "ok"
//         };
//         // console.log(response);
//         res.status(200).json(responseData);
//     } else {
//         res.json({ status: "error", message: "Invalid Password" });
//     }
// });

app.post("/company-login", async (req, res) => {
    const { phone, password } = req.body;

    const user = await Company.findOne({ phone });

    if (!user) {
        return res.send({ error: "Company Not Found" });
    }
    if (await bcrypt.compare(password, user.password)) {
        const data = {
            user: {
                id: user._id,
            },
        };
        const token = jwt.sign(data, JWT_SECRET);

        // Include organization ID in the response if available
        const responseData = {
            documentstatus: user.documentstatus,
            isverified: user.isverified,
            organizationId: user.organizationId, // Add this line if organizationId exists in Company schema
            token: token,
            status: "ok"
        };

        res.status(200).json(responseData);
    } else {
        res.json({ status: "error", message: "Invalid Password" });
    }
});




app.post('/update-company-details', fetchUser, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized", status: "error" });
        }

        const userID = req.user.id;
        const userExist = await Company.findOne({ _id: userID }, { password: 0 });
        const { companyname, tradelicenseno, region, companyaddress } = req.body;
        console.log(req.body);

        if (userExist) {
            await Company.findByIdAndUpdate(
                userExist.id,
                {
                    $set: {
                        companyname,
                        tradelicenseno,
                        region,
                        companyaddress,
                    }
                }
            );
            res.status(200).json({ message: "Company Details Updated", status: "ok" });
        } else {
            res.status(400).json({ message: "Something Went Wrong While Updating", status: "error" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


app.post('/owner-details', fetchUser, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized", status: "error" });
        }

        const userID = req.user.id;
        const userExist = await Company.findOne({ _id: userID }, { password: 0 });
        const { owneremiratesId, ownerpassportno, contactpersonname, contactpersonno, tradelicenseexp, companylocation } = req.body;

        console.log(req.body);

        if (userExist) {
            await Company.findByIdAndUpdate(
                userExist.id,
                {
                    $set: {
                        owneremiratesId,
                        ownerpassportno,
                        contactpersonname,
                        contactpersonno,
                        tradelicenseexp,
                        companylocation,
                    }
                }
            );
            res.status(200).json({ message: "Company Details Updated", status: "ok" });
        } else {
            res.status(400).json({ message: "Something Went Wrong While Updating", status: "error" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


app.post('/upload-company-documents', fetchUser, upload.array('file', 5), async (req, res) => {
    try {
        console.log("hitting");
        const organizationId = req.user.id;
        const companyExist = await Company.findOne({ _id: organizationId }, { password: 0 });

        if (companyExist) {
            let s3 = new aws.S3();
            let uploadPromises = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const { path, filename, originalname } = file;
                    const documentType = originalname.split("-")[0];
                    let uploadParams = { Bucket: 'gadgetsrebon', Key: '', Body: '', ACL: 'public-read' };
                    let fileName = uid() + filename;

                    let fileStream = fs.createReadStream(path);
                    fileStream.on('error', function (err) {
                        console.log('File Error', err);
                        reject(err);
                    });

                    uploadParams.Body = fileStream;
                    uploadParams.Key = fileName;

                    s3.upload(uploadParams, function (err, data) {
                        if (err) {
                            console.log("Error", err);
                            reject(err);
                        } else {
                            fs.unlink(path, (unlinkErr) => {
                                if (unlinkErr) {
                                    console.error('Error deleting file:', unlinkErr);
                                    reject(unlinkErr);
                                }
                                resolve({ [documentType]: data.Location });
                            });
                        }
                    });
                });
            });

            let uploadedFilesLocations = await Promise.all(uploadPromises);

            // Combine all file locations into one object
            let companyFiles = Object.assign({}, ...uploadedFilesLocations);

            const updatedUser = await Company.findByIdAndUpdate(organizationId, {
                '$set': { 'verificationDoc': companyFiles, 'documentstatus': true }
            });

            if (updatedUser) {
                res.send("Uploaded Successfully");
            } else {
                res.send("Something Went Wrong");
            }
        } else {
            res.status(404).send("Company not found");
        }
    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    }

});

app.get('/company-details', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await Company.findOne({ _id: userID }, { password: 0, _id: 0 });
        if (userExist) {
            res.status(200).json({ data: userExist, status: 'ok' })
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

//Fetch All Company Data
app.get("/getAllCompany", fetchUser, async (req, res) => {

    try {
        const adminID = req.user.id;
        const adminExist = await Admin.findOne({ _id: adminID }, { password: 0 });
        const companyID = req.params.ID;
        if (adminExist) {
            const allCompany = await Company.find({});
            res.send({ status: "ok", data: allCompany });
        } else {
            res.status(404).send("Admin not found");
        }
    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    }
});


// Fetch Loggedin Company Data 
app.get("/getUserDetails", fetchUser, async (req, res) => {
    try {
        // Assuming fetchUser middleware sets req.user with user details
        const user = req.user;
        res.status(200).json({ message: "User details found", user });
    } catch (error) {
        res.status(500).json({ message: "Error occurred while fetching user details", error: error.message });
    }
});




app.get('/companyverifiedornot', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await Company.findOne({ _id: userID }, { password: 0, _id: 0 });

        if (userExist) {

            const response = await Company.findOne(
                {
                    isverified: userExist.isverified,
                    documentstatus: userExist.documentstatus,
                })
            console.log(response);
            if (response) {
                res.status(200).json({ data: response, status: "ok", })
            } else {
                res.status(200).json({ message: "something went wrong" })
            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})









//////////////////////////////////////// Register Freelancer Technicians ////////////////////////////////////////////

app.get('/technician-details', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await Technician.findOne({ _id: userID }, { password: 0, _id: 0 });
        if (userExist) {
            res.status(200).json({ data: userExist, status: 'ok' })
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})


// Technician Register API
app.post('/technician-register', async (req, res) => {
    try {
        const { username, fname, password, email, phone, emiratesId, passportno, organizationId } = req.body;

        // Check if the email is already registered for the same organization
        const existingUserWithEmail = await Technician.findOne({ email, organizationId });
        const existingUserWithPhone = await Technician.findOne({ phone, organizationId });
        const existingUserWithEmiratesId = await Technician.findOne({ emiratesId, organizationId });

        if (existingUserWithEmail && existingUserWithPhone && existingUserWithEmiratesId) {
            return res.status(400).json({ message: 'Email, phone number, and Emirates ID already registered for this organization' });
        } else if (existingUserWithEmail && existingUserWithPhone) {
            return res.status(400).json({ message: 'Email and phone number already registered for this organization' });
        } else if (existingUserWithEmail && existingUserWithEmiratesId) {
            return res.status(400).json({ message: 'Email and Emirates ID already registered for this organization' });
        } else if (existingUserWithPhone && existingUserWithEmiratesId) {
            return res.status(400).json({ message: 'Phone number and Emirates ID already registered for this organization' });
        } else if (existingUserWithEmail) {
            return res.status(400).json({ message: 'Email already registered for this organization' });
        } else if (existingUserWithPhone) {
            return res.status(400).json({ message: 'Phone number already registered for this organization' });
        } else if (existingUserWithEmiratesId) {
            return res.status(400).json({ message: 'Emirates ID already registered for this organization' });
        }

        // Create a new user
        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = new Technician({
            username,
            fname,
            password: encryptedPassword,
            email,
            phone,
            emiratesId,
            passportno,
            organizationId,
            isOrganization: true
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with success
        res.status(201).json({ message: 'Registration successful', status: 'ok', id: newUser._id });

        // if status is ok and technician will be added then add the technican id into the Company Schema
        const company = await Company.findOne({ organizationId });
        if (company) {
            company.technician.push({ technicianId: newUser.technicianId });
            await company.save();
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/uploadsdocuments/:ID', fetchUser, upload.array('file', 5), async (req, res) => {
    try {
        console.log("hitting");
        const technicianId = req.params.ID;
        console.log(technicianId);
        const technicianExist = await Technician.findOne({ _id: technicianId }, { password: 0 });

        if (technicianExist) {
            let s3 = new aws.S3();
            let uploadPromises = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const { path, filename, originalname } = file;
                    const documentType = originalname.split("-")[0];
                    let uploadParams = { Bucket: 'gadgetsrebon', Key: '', Body: '', ACL: 'public-read' };
                    let fileName = uid() + filename;

                    let fileStream = fs.createReadStream(path);
                    fileStream.on('error', function (err) {
                        console.log('File Error', err);
                        reject(err);
                    });

                    uploadParams.Body = fileStream;
                    uploadParams.Key = fileName;

                    s3.upload(uploadParams, function (err, data) {
                        if (err) {
                            console.log("Error", err);
                            reject(err);
                        } else {
                            fs.unlink(path, (unlinkErr) => {
                                if (unlinkErr) {
                                    console.error('Error deleting file:', unlinkErr);
                                    reject(unlinkErr);
                                }
                                resolve({ [documentType]: data.Location });
                            });
                        }
                    });
                });
            });

            let uploadedFilesLocations = await Promise.all(uploadPromises);

            // Combine all file locations into one object
            let technicianFiles = Object.assign({}, ...uploadedFilesLocations);

            const updatedUser = await Technician.findByIdAndUpdate(technicianId, {
                '$set': { 'verificationDoc': technicianFiles }
            });

            if (updatedUser) {
                res.send("uploaded successfully");
            } else {
                res.send("something went wrong");
            }
        } else {
            res.status(404).send("Technician not found");
        }
    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    }

});



app.get('/technicians/:organizationId', async (req, res) => {
    try {
        const { organizationId } = req.params;

        // Find all technicians with the specified organizationId
        const technicians = await Technician.find({ organizationId: organizationId });

        // Respond with the list of technicians
        res.status(200).json({ technicians: technicians });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/technician-email-verification', async (req, res) => {
    try {
        const { email } = req.body;

        // if any empty property remains
        if (!email) {
            return res
                .status(404)
                .json({ message: "Please fill the required field" });
        }
        // checking whether user exist
        const userExist = await Technician.findOne({ email: email });
        if (userExist) {
            console.log("Technician Exist");
            return res.status(422).json({ message: "Technician Already Exist" });
        }
        await sendEmailVerification(email);

        // for time out of OTP after 60 seconds
        OTPTIMEOUT(email);
        res.status(200).json({ message: "OTP sent Successfully", status: "ok" });
    } catch (error) {
        console.log(error.message);
    }
})

// for OTP verification
app.post('/technician-otp-verification', async (req, res) => {
    const { otp, email } = req.body;
    try {
        console.log(otp, email);

        // Check if the email already exists
        const existingUser = await Technician.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Technician already exists" });
        }

        // Check if the OTP is valid
        const storedOTP = map.get(email);
        if (storedOTP && (+otp) === storedOTP) {
            console.log("Verification done");
            res.status(200).json({ message: "Verification done", status: "ok" });
        } else {
            res.status(400).json({ message: "Wrong OTP" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// sending otp using smsglobal
app.post('/technician-mobile-otp', async (req, res) => {
    try {
        console.log("reached");
        const phonenumber = req.body.phone;

        const oldPhone = await Technician.findOne({ phone: req.body.phone });

        if (oldPhone) {
            return res.status(400).json({ message: "phone number already exist" });
        }

        const response = await client.verify.v2.services(servicesid)
            .verifications
            .create({ to: phonenumber, channel: 'sms' });
        console.log(response);
        if (response) {
            res.status(200).json({ message: "OTP sent successfully", status: "ok" })
        } else {
            res.status(500).json({ message: "Error sending mobile OTP", error: error.message });
        }


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending mobile OTP", error: error.message });
    }
});

// technician-Login API
app.post("/technician-login", async (req, res) => {
    const { email, password } = req.body;

    const user = await Technician.findOne({ email });

    if (!user) {
        return res.send({ error: "Technician Not Found" });
    }
    if (await bcrypt.compare(password, user.password)) {

        const data = {
            user: {
                id: user._id,
            },
        };
        const token = jwt.sign(data, JWT_SECRET);
        // const response = await Orders.findOne({ orderId: user.currentOrderId })
        // console.log(response);
        res.status(200).json({ status: "ok", token: token });
    } else {
        res.json({ status: "error", message: "Invalid Password" });
    }
});

//Fetch All Technicians Data
app.get("/getAllTechnicians", fetchUser, async (req, res) => {

    try {
        const adminID = req.user.id;
        const adminExist = await Admin.findOne({ _id: adminID }, { password: 0 });
        const technicianID = req.params.ID;
        if (adminExist) {
            const allTechnicians = await Technician.find({});
            res.send({ status: "ok", data: allTechnicians });
        } else {
            res.status(404).send("Admin not found");
        }
    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    }
});

//Fetch All Technicians Data
app.get("/getAllVerifiedTechnicians", fetchUser, async (req, res) => {
    try {
        const adminID = req.user.id;
        const adminExist = await Admin.findOne({ _id: adminID }, { password: 0 });

        if (adminExist) {
            const allTechnicians = await Technician.find({ isverified: true });
            res.send({ status: "ok", data: allTechnicians });
        } else {
            res.status(404).send("Admin not found");
        }
    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    }
});

app.post("/allotTechnician", fetchUser, async (req, res) => {
    try {
        const adminID = req.user.id;
        const adminExist = await Admin.findOne({ _id: adminID }, { password: 0 });
        const allotedTechnician = req.body.technicianID;
        const orderID = req.body.orderID;

        if (adminExist) {

            // update the order by alloting technician for the user
            await Orders.findOneAndUpdate({ orderId: orderID }, {
                '$set': {
                    'technicianAllotted': allotedTechnician
                }
            });

            // now assign the job to the technician

            const order = await Orders.findOne({ orderId: orderID });

            const job = {
                jobid: order.orderId,
                allotedAt: new Date(), // Use the current date and time
                jobstart: null,
                jobend: null,
                payment: 0,
                work: order.work,
                address: order.address,
            };

            const response = await Technician.findByIdAndUpdate(allotedTechnician, {
                $push: {
                    jobs: job,
                },
            });

            if (response) {
                res.status(200).json({ message: "Technician allotted successfully" });
            } else {
                res.status(404).json({ message: "Technician not found" });
            }

        } else {
            res.status(404).send("Admin not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message || "An error occurred");
    }
});

// API For Paginated Technicians
app.get("/paginatedTechnicians", async (req, res) => {
    const allUser = await Technician.find({});
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const lastIndex = (page) * limit

    const results = {}
    results.totalUser = allUser.length;
    results.pageCount = Math.ceil(allUser.length / limit);

    if (lastIndex < allUser.length) {
        results.next = {
            page: page + 1,
        }
    }
    if (startIndex > 0) {
        results.prev = {
            page: page - 1,
        }
    }

    results.result = allUser.slice(startIndex, lastIndex);

    res.json(results)
})

// Update Technicians Data API
app.post("/updateTechnicians", async (req, res) => {
    try {
        const { _id, fname, base64 } = req.body;
        // Use Mongoose to update the user by _id
        const updatedUser = await Technician.findByIdAndUpdate(_id, { fname, image: base64, }, { new: true });

        if (!updatedUser) {
            // If user not found, return an error
            return res.status(404).json({ error: "User not found" });
        }

        // User updated successfully, send the updated user as a response
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        // Handle any errors and send an error response
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/uploads', upload.single('file'), (req, res) => {
    console.log(req.body);
    console.log(req.file, fileName);
    res.json({ message: "hello from the backend" });
})

app.post('/upload-documents', fetchUser, upload.array('file', 5), async (req, res) => {
    try {
        console.log("hitting");
        const technicianId = req.user.id;
        const technicianExist = await Technician.findOne({ _id: technicianId }, { password: 0 });

        if (technicianExist) {
            let s3 = new aws.S3();
            let uploadPromises = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    const { path, filename, originalname } = file;
                    const documentType = originalname.split("-")[0];
                    let uploadParams = { Bucket: 'gadgetsrebon', Key: '', Body: '', ACL: 'public-read' };
                    let fileName = uid() + filename;

                    let fileStream = fs.createReadStream(path);
                    fileStream.on('error', function (err) {
                        console.log('File Error', err);
                        reject(err);
                    });

                    uploadParams.Body = fileStream;
                    uploadParams.Key = fileName;

                    s3.upload(uploadParams, function (err, data) {
                        if (err) {
                            console.log("Error", err);
                            reject(err);
                        } else {
                            fs.unlink(path, (unlinkErr) => {
                                if (unlinkErr) {
                                    console.error('Error deleting file:', unlinkErr);
                                    reject(unlinkErr);
                                }
                                resolve({ [documentType]: data.Location });
                            });
                        }
                    });
                });
            });

            let uploadedFilesLocations = await Promise.all(uploadPromises);

            // Combine all file locations into one object
            let technicianFiles = Object.assign({}, ...uploadedFilesLocations);

            const updatedUser = await Technician.findByIdAndUpdate(technicianId, {
                '$set': { 'verificationDoc': technicianFiles }
            });

            if (updatedUser) {
                res.send("uploaded successfully");
            } else {
                res.send("something went wrong");
            }
        } else {
            res.status(404).send("Technician not found");
        }
    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    }

});



app.post('/technician-job-start', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const { jobId, jobstart } = req.body;

        const response = await Technician.findOneAndUpdate(
            { _id: userID, 'jobs.jobid': jobId },
            { '$set': { 'jobs.$.jobstart': jobstart } },
            { new: true }
        );

        if (response) {
            res.status(200).json({ message: "Job Start successfully", status: "ok" });
        } else {
            res.status(404).json({ message: "Job not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Endpoint to update job finish time
app.post('/technician-job-finish', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const { jobId, jobend } = req.body;

        const response = await Technician.findOneAndUpdate(
            { _id: userID, 'jobs.jobid': jobId },
            { '$set': { 'jobs.$.jobend': jobend } },
            { new: true }
        );

        if (response) {
            res.status(200).json({ message: "Job Finish successfully", status: "ok" });
        } else {
            res.status(404).json({ message: "Job not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



// Add Technician Bank Account 

app.post('/add-technician-bank-account', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await Technician.findOne({ _id: userID }, { password: 0, _id: 0 });

        const fullname = req.body.Fullname;
        const accountno = req.body.AccountNo;
        const iban = req.body.IBAN;

        if (!fullname || !accountno || !iban) {
            return res.status(400).json({ message: "Required All Fields" });
        }

        if (userExist) {
            const response = await Technician.findOneAndUpdate({ _id: userID }, {
                '$set': {
                    'bankDetails.Fullname': fullname,
                    'bankDetails.AccountNo': accountno,
                    'bankDetails.IBAN': iban
                }
            }, { new: true });

            if (response) {
                res.status(200).json({ message: "Bank details updated successfully", status: "ok" });
            } else {
                res.status(500).json({ message: "Something went wrong while updating bank details" });
            }
        } else {
            res.status(404).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});




///////////////////// Admin Dashboard ////////////////////////

app.get('/technicianVerify/:ID', fetchUser, async (req, res) => {
    try {
        const adminID = req.user.id;
        const adminExist = await Admin.findOne({ _id: adminID }, { password: 0 });
        const technicianID = req.params.ID;
        if (adminExist) {
            const updatedUser = await Technician.findByIdAndUpdate(technicianID, {
                '$set': { 'isverifiedtech': true }
            });

            if (updatedUser) {
                res.status(200).json({ message: "technicican verified sucessfully" });
            }
        } else {
            res.status(404).send("Admin not found");
        }
    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    }
})


app.get('/companyVerify/:ID', fetchUser, async (req, res) => {
    try {
        const adminID = req.user.id;
        const adminExist = await Admin.findOne({ _id: adminID }, { password: 0 });
        const companyID = req.params.ID;
        if (adminExist) {
            const updatedCompany = await Company.findByIdAndUpdate(companyID, {
                '$set': { 'isverified': true }
            });

            if (updatedCompany) {
                res.status(200).json({ message: "Company verified sucessfully" });
            }
        } else {
            res.status(404).send("Admin not found");
        }
    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    }
})


app.post("/login-admin", async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await Admin.findOne({ email });

        if (!user) {
            return res.send({ error: "Admin Not Found" });
        }
        if (await bcrypt.compare(password, user.password)) {

            const data = {
                user: {
                    id: user._id,
                },
            };
            const token = jwt.sign(data, JWT_SECRET);

            res.status(200).json({ status: "ok", token: token, message: "Login Successfully" });
        } else {
            res.json({ status: "error", message: "Invalid Password" });
        }
    } catch (error) {
        console.log(error);
    }
});


app.get('/getTotalOrders/:technicianId', async (req, res) => {
    try {
        const technicianId = req.params.technicianId;

        // Count the number of orders where the technicianAllotted field matches the provided technicianId
        const totalOrders = await Orders.countDocuments({ technicianAllotted: technicianId });

        res.json({ status: 'ok', data: totalOrders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


// fetch all the order of the user
app.get('/fetch-technicians-orders', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await Technician.findOne({ _id: userID }, { password: 0 });

        if (userExist) {
            const response = await Orders.find({ technicianAllotted: userID });

            if (response) {
                res.status(200).json({ data: response, status: "ok" });
            } else {
                res.status(200).json({ message: "something went wrong" });
            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// fethcing the particular order
app.get('/fetch-technicians-orders/:ID', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;
        const userExist = await Technician.findOne({ _id: userID }, { password: 0 });
        const orderID = req.params.ID;


        if (userExist) {
            // console.log(userExist.id);
            const response = await Orders.findOne({ orderId: orderID })
            // console.log(response);
            if (response) {
                res.status(200).json({ data: response, status: "ok", })
            } else {
                res.status(200).json({ message: "something went wrong" })
            }
        } else {
            res.status(200).json({ message: "User does not exist" });
        }

    } catch (error) {
        console.log(error);
    }
})

app.get("/fetch-all-orders", fetchUser, async (req, res) => {

    try {
        const adminID = req.user.id;
        const adminExist = await Admin.findOne({ _id: adminID }, { password: 0 });

        if (adminExist) {
            const orders = await Orders.find({});
            res.status(200).json({ status: "ok", data: orders });
        } else {
            res.status(200).json({ status: "ok", message: "wrong credentials" });
        }
    } catch (error) {
        res.send({ message: "error", error });
    }
});

app.post('/withdrawal', fetchUser, async (req, res) => {
    try {
        const { withdrawalamount } = req.body;

        // Validating the withdrawal amount
        if (!withdrawalamount) {
            return res.status(400).json({ message: "Withdrawal amount is required" });
        }

        const userID = req.user.id;

        // Check if the user exists
        const userExist = await Technician.findOne({ _id: userID });
        if (!userExist) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Creating a new withdrawal request
        const newWithdrawalRequest = {
            withdrawalamount,
            // withdrawalrequestdatetime will be set to default (current time)
            // withdrawalrequeststatus will be set to default ("inprogress")
        };

        // Update the technician's document with the new withdrawal request
        const updatedUser = await Technician.findByIdAndUpdate(userID,
            { $push: { withdrawalrequest: newWithdrawalRequest } },
            { new: true }
        );

        if (updatedUser) {
            return res.status(200).json({ message: "Withdrawal Request sent successfully", status: "ok" });
        } else {
            return res.status(500).json({ message: "Failed to send Withdrawal Request" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/technician/withdrawal-requests', fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;

        // Find the technician by userID
        const technician = await Technician.findById(userID);

        if (!technician) {
            return res.status(404).json({ message: "Technician not found" });
        }

        // Send the withdrawal requests to the client
        res.json({ withdrawalRequests: technician.withdrawalrequest });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/getAllTechnician", async (req, res) => {
    try {
        const allUser = await Technician.find({});
        res.send({ status: "ok", data: allUser });
    } catch (error) {
        console.log(error);
    }
});

app.post('/Technician-notifications-added', async (req, res) => {
    try {
        const { userId, notificationtype, notification } = req.body;

        // Check if the user exists
        const userExist = await Technician.findOne({ _id: userId });
        if (!userExist) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Creating a new notification
        const newNotification = {
            notificationtype,
            notificationmessage: notification,  // Correct the property name
        };

        // Update the technician's document with the new notification
        const updatedUser = await TechnicianNotification.findByIdAndUpdate(userId,
            { $push: { notification: newNotification } },
            { new: true }
        );

        if (updatedUser) {
            return res.status(200).json({ message: "Notification sent successfully", status: "ok" });
        } else {
            return res.status(500).json({ message: "Failed to send notification" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/techniciannotifications-added", async (req, res) => {
    const { user, notificationtype, notification } = req.body;
    try {
        await TechnicianNotification.create({
            user,
            notificationtype,
            notification
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error", error });
    }
})

app.get("/alltech-notifications", async (req, res) => {
    try {
        const alltechnotifications = await TechnicianNotification.find({});
        res.send({ status: "ok", data: alltechnotifications });
    } catch (error) {
        console.log(error);
    }
})


app.get("/fetch-all-tech-notifications", fetchUser, async (req, res) => {
    try {
        const userID = req.user.id;

        // Fetch notifications specific to the technician
        const techNotifications = await TechnicianNotification.find({ user: userID });

        if (techNotifications.length > 0) {
            res.status(200).json({ status: "ok", data: techNotifications });
        } else {
            res.status(200).json({ status: "ok", message: "No Any Notification Exists" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "error", error: error.message });
    }
});

app.post('/notifications/mark-as-read/:notificationId', fetchUser, async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await TechnicianNotification.findByIdAndUpdate(
            notificationId,
            { $set: { isRead: true } }, // Corrected this line
            { new: true }
        );
        if (!notification) {
            return res.status(404).send('Notification not found');
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).send('Server error');
    }
});


///////////////////////////////// Admin Panel Console ///////////////////////////////////////////////

// Admin Panel Types, Modals, Brand & defect Options
app.post("/types", async (req, res) => {
    try {
        // Extract type data from the request body
        const { name } = req.body;

        // Check if the type with the same name already exists
        const existingType = await Type.findOne({ name });

        if (existingType) {
            // If the type already exists, return an error response
            return res.status(400).json({ message: "Type with the same name already exists" });
        }

        // Create a new instance of the Type model
        const newType = new Type({ name });

        // Save the new type instance to the database
        await newType.save();

        // Send a success response
        res.status(201).json({ message: "Type added successfully", type: newType });
    } catch (error) {
        // Send an error response if something goes wrong
        console.error(error);
        res.status(500).json({ message: "Error adding type", error: error.message });
    }
});

app.post("/mobilebrands", async (req, res) => {
    try {
        const { name, type } = req.body;

        // Check if brand name already exists and is connected with any type
        const existingBrand = await Mobilebrands.findOne({ name, type });

        if (existingBrand !== null && existingBrand !== undefined) {
            // Brand name already exists and is connected with the provided type
            return res.status(400).json({ message: "Brand name already exists and is connected with the provided type" });
        }

        // Brand name does not exist or is not connected with the provided type, proceed with adding the brand
        const newBrand = new Mobilebrands({ name, type });
        await newBrand.save();
        res.status(201).json({ message: "Brand added successfully", brand: newBrand });
        console.log(newBrand);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding brand", error: error.message });
    }
});


app.post("/series", async (req, res) => {
    try {
        const { seriesname, brand, type } = req.body;

        // Check if a series with the same name, brand, and type already exists
        const existingSeries = await Series.findOne({ seriesname, brand, type });

        if (existingSeries) {
            // Series with the same name, brand, and type already exists
            return res.status(400).json({ message: "Series with the same name, brand, and type already exists" });
        }

        // Series does not exist, proceed with adding the new series
        const newSeries = new Series({ seriesname, brand, type });
        await newSeries.save();

        res.status(201).json({ message: "Series added successfully", series: newSeries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding series", error: error.message });
    }
});

app.post("/modals", async (req, res) => {
    try {
        const { modelname, series, brand, type } = req.body;

        // Check if a modal with the same modelname, series, brand, and type already exists
        const existingModal = await Models.findOne({ modelname, series, brand, type });

        if (existingModal) {
            // Modal with the same details already exists
            return res.status(400).json({ message: "Modal with the same details already exists" });
        }

        // Modal does not exist, proceed with adding the new modal
        const newModal = new Models({ modelname, series, brand, type });
        await newModal.save();

        res.status(201).json({ message: "Modal added successfully", modal: newModal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding modal", error: error.message });
    }
});


app.post("/defects", async (req, res) => {
    try {
        const { defectname, model, type, brand, series } = req.body;

        // Check if the defect name already exists for the given type, brand, series, and model
        const existingDefect = await Defect.findOne({ defectname, model, type, brand, series });
        if (existingDefect) {
            return res.status(400).json({ message: "Defect with the same name and details already exists" });
        }

        // Defect does not exist, proceed with adding the new defect
        const newDefect = new Defect({ defectname, model, type, brand, series });
        await newDefect.save();
        res.status(201).json({ message: "Defect added successfully", defect: newDefect });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding defect", error: error.message });
    }
});


app.get("/gettypes", async (req, res) => {
    try {
        const types = await Type.find();
        res.status(200).json(types);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching types", error: error.message });
    }
});

app.get("/getbrands", async (req, res) => {
    try {
        const brands = await Mobilebrands.find().populate('type');
        res.status(200).json(brands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching brands", error: error.message });
    }
});

app.get("/getbrands/:typeId", async (req, res) => {
    try {
        const typeId = req.params.typeId;
        // Assuming Mobilebrands is your Mongoose model
        const brands = await Mobilebrands.find({ type: typeId });
        res.status(200).json(brands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching brands", error: error.message });
    }
});

app.get("/getseries", async (req, res) => {
    try {
        const series = await Series.find().populate('brand').populate('type');
        res.status(200).json(series);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching series", error: error.message });
    }
});

app.get("/getmodals", async (req, res) => {
    try {
        const modals = await Models.find().populate('series').populate('brand').populate('type');
        res.status(200).json(modals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching modals", error: error.message });
    }
});

app.get("/getdefects", async (req, res) => {
    try {
        const defects = await Defect.find()
            .populate('model')
            .populate('series')
            .populate('brand')
            .populate('type');
        res.status(200).json(defects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching defects", error: error.message });
    }
});







// Server port No.
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server Started");
});