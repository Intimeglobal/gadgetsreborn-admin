import React, { Component } from 'react';
import app from "./firebase_config";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const auth = getAuth(app);

export default class TechnicianRegister extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fname: "",
            email: "",
            userType: "Technician",
            phone: "",
            password: "",
            verifyButton: false,
            verifyOtp: false,
            otp: "",
            verified: false,
            showAlert: false, // State variable to control the alert visibility
            alertMessage: "",
            alertType: "", // "success", "warning", "danger", etc.
        };
        this.handelSubmit = this.handelSubmit.bind(this);
        this.onSignInSubmit = this.onSignInSubmit.bind(this);
        this.verifyCode = this.verifyCode.bind(this);
    }

    onCaptchVerify() {

        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                this.onSignInSubmit();
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // ...
            },
        });
    }

    showAlert(message, type) {
        this.setState({
            showAlert: true,
            alertMessage: message,
            alertType: type,
        });
    }

    hideAlert() {
        this.setState({
            showAlert: false,
            alertMessage: "",
            alertType: "",
        });
    }

    onSignInSubmit() {
        this.onCaptchVerify();
        const phoneNumber = "+971" + this.state.phone;
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                // alert("otp Sended");
                this.showAlert("otp Sended", "success");

                this.setState({ verifyOtp: true })
                // ...
            }).catch((error) => {
                // Error; SMS not sent
                // ...
            });
    }

    verifyCode() {
        window.confirmationResult.confirm(this.state.otp).then((result) => {
            // User signed in successfully.
            const user = result.user;
            console.log(user);
            // alert("Verification Done");
            this.showAlert("Verification Done", "success");
            this.setState({
                verified: true,
                verifyOtp: false,
            })
            // ...
        }).catch((error) => {
            // alert("Invalid Otp");
            this.showAlert("Invalid Otp", "danger");
            // User couldn't sign in (bad verification code?)
            // ...
        });
    }

    changeMobile(e) {
        this.setState({ phone: e.target.value }, function () {
            if (this.state.phone.length === 10) {
                this.setState({
                    verifyButton: true,
                })
            }
        })
    }


    handelSubmit(e) {
        e.preventDefault();

        if (this.state.verified) {
            const { fname, lname, username, userType, email, phone, password, image } = this.state;
            console.log(fname, lname, username, email, userType, phone, password, image);
            fetch("http://localhost:5000/technicianregister", {
                method: "POST",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    fname,
                    lname,
                    email,
                    userType,
                    username,
                    phone,
                    password,
                    base64: image,
                }),
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data, "userRegister");
                    if (data.status === "ok") {
                        // alert("Register Successful");
                        this.showAlert("Register Successful", "success");
                        window.location.href = "./login"
                    } else {
                        this.showAlert("Registration Error", "danger");
                    }
                });
        } else {
            this.showAlert("Please Verify Phone", "danger");
            // alert("Please Verify Phone")
        }
    }

    render() {
        return (
            <div className="container">
                <div className="row mt-5">
                    <div id="recaptcha-container"></div>
                    <div className="col-7 bg-light py-4 text-center">
                        <img src="images/gadgets_rebon-login.png" width="65%" alt="" />
                    </div>
                    <div className="col-5 pt-4">
                        <h3 className="text-center text-dark">Register as a Technician</h3>
                        <h3 className="text-center text-dark">Welcome to Gadgets Reborn</h3>
                        {this.state.showAlert && (
                            <div className={`alert alert-${this.state.alertType} mt-3`} role="alert">
                                {this.state.alertMessage}
                                {/* <button
                                    type="button"
                                    className="close"
                                    aria-label="Close"
                                    onClick={() => this.hideAlert()}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button> */}
                            </div>
                        )}
                        <form onSubmit={this.handelSubmit}>
                            <div className="mb-3 d-none">
                                <input type="radio" checked="checked" className="form-control"
                                    onChange={(e) => this.setState({ userType: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-secondary">Username</label>
                                <input type="text" className="form-control"
                                    placeholder="Enter your username"
                                    onChange={(e) => this.setState({ username: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-secondary">Email address</label>
                                <input type="email" className="form-control" placeholder="Enter your email"
                                    onChange={(e) => this.setState({ email: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-secondary">Phone</label>
                                <div className="d-flex">
                                    <input type="text" className="form-control" placeholder="Enter your phone"
                                        onChange={(e) => this.changeMobile(e)} />
                                    {this.state.verifyButton ?
                                        <input type="button" onClick={this.onSignInSubmit} value={this.state.verified ? "Verified" : "Verify"} className="ml-3 btn btn-primary" /> : null
                                    }

                                </div>
                            </div>
                            {this.state.verifyOtp ?
                                <div className="mb-3">
                                    <label className="form-label text-secondary">OTP</label>
                                    <div className="d-flex">
                                        <input type="number" className="form-control" placeholder="Enter otp"
                                            onChange={(e) => this.setState({ otp: e.target.value })} />
                                        <input type="button" value="Verify OTP" onClick={this.verifyCode} className="ml-3 btn btn-primary px-3" />
                                    </div>
                                </div> : null}
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <label className="form-label text-secondary">Password</label>
                                </div>
                                <input type="password" className="form-control"
                                    placeholder="Enter your password"
                                    onChange={(e) => this.setState({ password: e.target.value })} />
                            </div>

                            <button type="submit" className="btn btn-primary w-100 d-block">Sign Up</button>
                        </form>
                        <p className="text-center text-secondary pt-4">Already have an account? <a href="/">Sign In</a></p>
                    </div>
                </div>
            </div>
        )
    }
}
