const express = require("express");
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


let map = new Map([]);



// path to .env file
dotenv.config({ path: path.join(__dirname, '.env') })

const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;

const cors = require("cors");
app.use(cors());

// Create a storage engine for multer
const storage = multer.memoryStorage();

// Initialize multer with the storage engine
const upload = multer({ storage: multer.memoryStorage() });

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
require("./schema/product");
require("./schema/modal");
require("./schema/orders");
require("./schema/warranty");
require("./schema/notification");

const User = mongoose.model("UserInfo");
const Technician = mongoose.model("TechnicianInfo");
const Products = mongoose.model("ProductInfo");
const Models = mongoose.model("ModelInfo");
const Orders = mongoose.model("OrdersInfo");
const Warranty = mongoose.model("WarrantyInfo");
const Notification = mongoose.model("NotificationInfo");


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
            name: "Anonymous",
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

        // image.create({ image: base64 });
        if (oldEmail) {
            return res.json({ error: "Email Already Registered" });
        }
        // if (oldUsername) {
        //     return res.json({ error: "Username Already Exists" });
        // }
        if (oldPhone) {
            return res.json({ error: "Phone Number Already Exists" });
        }
        await User.create({
            fname,
            username,
            email,
            phone,
            userType,
            image: base64,
            password: encryptedPassword,
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error", error });
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
        if (userExist)
            return res.status(422).json({ message: "User Already Exist" });

        await sendEmailVerification(email);

        // for time out of OTP after 60 seconds
        OTPTIMEOUT(email);
        res.status(200).json({ message: "OTP sent Successfully" });
    } catch (error) {
        console.log(error.message);
    }
})


app.post('/mobile-email-verification', async (req, res) => {
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
        if (!userExist)
            return res.status(422).json({ message: "User does not Exist" });

        await sendEmailVerification(email);

        // for time out of OTP after 60 seconds
        OTPTIMEOUT(email);
        res.status(200).json({ message: "OTP sent Successfully", status: "ok" });
    } catch (error) {
        console.log(error.message);
    }
})
// API for checking the OTP
app.post('/checking-otp', async (req, res) => {
    const otp = req.body.otp;
    const email = req.body.email;

    if ((+otp) === map.get(email)) {
        res.status(200).json({ message: "Email verfied successfully", verified: true });
    } else {
        res.status(404).json({ message: "OTP does not match", verified: false });
    }
})

// Login API
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.send({ error: "User Not Found" });
    }
    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
            { email: user.email, userType: user.userType },
            JWT_SECRET,
            {
                expiresIn: "30m",
            }
        );

        if (res.status(201)) {
            return res.json({ status: "ok", data: token });
        } else {
            return res.json({ error: "error" });
        }
    }
    res.json({ status: "error", error: "Invalid Password" });
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
    try {
        const user = jwt.verify(token, JWT_SECRET, (err, res) => {
            if (err) {
                return "token expired";
            }
            return res;
        });
        console.log(user);
        if (user == "token expired") {
            return res.send({ status: "error", data: "token expired" });
        }
        const useremail = user.email;
        User.findOne({ email: useremail })
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

// Update User Data API
app.post('/updateUser', upload.single('image'), async (req, res) => {
    try {
        const { _id, fname, address, role, instagram, facebook } = req.body;
        let base64 = null;

        if (req.file) {
            // Convert the image to base64
            base64 = req.file.buffer.toString('base64');
        }

        // Use Mongoose to update the user by _id
        const updatedUser = await User.findByIdAndUpdate(_id, { fname, address, role, instagram, facebook, image: base64 }, { new: true });

        if (!updatedUser) {
            // If user not found, return a 404 error
            return res.status(404).json({ error: 'User not found' });
        }

        // User updated successfully, send the updated user as a response
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        // Handle any errors and send an error response
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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

// Technician Register API
app.post("/technicianregister", async (req, res) => {
    const { fname, lname, username, email, phone, userType, password, base64 } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldEmail = await Technician.findOne({ email });
        const oldPhone = await Technician.findOne({ phone });
        if (oldEmail) {
            return res.json({ error: "Email Already Registered" });
        }

        if (oldPhone) {
            return res.json({ error: "Phone Number Already Exists" });
        }
        await Technician.create({
            fname,
            lname,
            username,
            email,
            phone,
            userType,
            image: base64,
            password: encryptedPassword,
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error", error });
    }
});

//Fetch All Technicians Data
app.get("/getAllTechnicians", async (req, res) => {
    try {
        const allTechnicians = await Technician.find({});
        res.send({ status: "ok", data: allTechnicians });
    } catch (error) {
        console.log(error);
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

// Modal Added API
app.post("/modal-added", async (req, res) => {
    const { modelname } = req.body;
    try {
        const oldModel = await Models.findOne({ modelname });
        if (oldModel) {
            return res.json({ error: "Model Already Exists" });
        }
        await Models.create({
            modelname,
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error", error });
    }
});

// Get All Models API
app.get("/models", async (req, res) => {
    try {
        const allModels = await Models.find({});
        res.send({ status: "ok", data: allModels });
    } catch (error) {
        console.log(error);
    }
});

// Delete Model From Database API
app.delete("/models/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deleteModel = await Models.findByIdAndDelete({ _id: id });
        if (!req.params.id) {
            return res.status(400).send();
        }
        res.send(deleteModel);
    } catch (error) {
        res.status(500).send(error);
    }
});

// API For Paginated Technicians
app.get("/paginatedModel", async (req, res) => {
    const allUser = await Models.find({});
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

// Product Added API
app.post("/product-added", async (req, res) => {
    const { modalname, productname, price, status } = req.body;
    try {
        await Products.create({
            modalname,
            productname,
            price,
            status,
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error", error });
    }
})

// Get All Product API
app.get("/products", async (req, res) => {
    try {
        const allProducts = await Products.find({});
        res.send({ status: "ok", data: allProducts });
    } catch (error) {
        console.log(error);
    }
});

// Update Products Data API
app.post("/updateProducts", async (req, res) => {
    try {
        const { _id, price, status } = req.body;
        // Use Mongoose to update the user by _id
        const updatedData = await Products.findByIdAndUpdate(_id, { price, status }, { new: true });

        if (!updatedData) {
            // If user not found, return an error
            return res.status(404).json({ error: "User not found" });
        }

        // User updated successfully, send the updated user as a response
        res.status(200).json({ message: "Product updated successfully", user: updatedData });
    } catch (error) {
        // Handle any errors and send an error response
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// API For Paginated Products
app.get("/paginatedProducts", async (req, res) => {
    const allProducts = await Products.find({});
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const lastIndex = (page) * limit

    const results = {}
    results.totalUser = allProducts.length;
    results.pageCount = Math.ceil(allProducts.length / limit);

    if (lastIndex < allProducts.length) {
        results.next = {
            page: page + 1,
        }
    }
    if (startIndex > 0) {
        results.prev = {
            page: page - 1,
        }
    }

    results.result = allProducts.slice(startIndex, lastIndex);

    res.json(results)
});

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
app.post("/warrantyadded", async (req, res) => {
    const { warrantyname, warrantystart, warrantyvalidthrough, warrantyprice } = req.body;
    try {
        await Warranty.create({
            warrantyname,
            warrantyprice,
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error", error });
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

// Server port No.
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server Started");
});