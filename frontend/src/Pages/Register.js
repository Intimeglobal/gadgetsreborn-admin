import React, { useState } from 'react';
import app from './firebase_config';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
    const [showpass, setShowpass] = useState(false);
    const auth = getAuth(app);

    const [state, setState] = useState({
        fname: '',
        lname: '',
        email: '',
        userType: 'User',
        phone: '',
        image: '',
        password: '',
        verifyButton: false,
        verifyOtp: false,
        otp: '',
        verified: false,
        showAlert: false,
        alertMessage: '',
        alertType: '',
    });

    const [emailstate, setEmailstate] = useState({
        verified: false,
        otpsend: false,
        otp: '',
    });

    const onCaptchVerify = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: (response) => {
                onSignInSubmit();
            },
        });
    };

    const showAlert = (message, type) => {
        setState({
            ...state,
            showAlert: true,
            alertMessage: message,
            alertType: type,
        });
    };

    const onSignInSubmit = () => {
        onCaptchVerify();
        const phoneNumber = '+971' + state.phone;
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                showAlert('OTP Sended', 'success');
                setState({
                    ...state,
                    verifyOtp: true,
                });
            })
            .catch((error) => {
                // Handle the error
            });
    };

    const verifyCode = () => {
        window.confirmationResult
            .confirm(state.otp)
            .then((result) => {
                const user = result.user;
                console.log(user);
                showAlert('Verification Done', 'success');
                setState({
                    ...state,
                    verified: true,
                    verifyOtp: false,
                });
            })
            .catch((error) => {
                showAlert('Invalid OTP', 'danger');
            });
    };

    const changeMobile = (e) => {
        const phone = e.target.value;
        if (phone.length === 10) {
            setState({
                ...state,
                phone,
                verifyButton: true,
            });
        } else {
            setState({
                ...state,
                phone,
                verifyButton: false,
            });
        }
    };

    const handleEmailVerification = (e) => {
        e.preventDefault();

        if (!state.email) {
            alert("please fill the email first");
        } else {
            console.log(state.email);
            fetch("http://localhost:5000/email-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    email: state.email
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setEmailstate({ ...emailstate, otpsend: true })
                    console.log(data);
                });
        }
    }

    const emailOtpChecker = (e) => {
        e.preventDefault();

        if (!emailstate.otp) {
            alert("please fill the email first");
        } else {
            console.log(emailstate.otp);
            fetch("http://localhost:5000/checking-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    otp: emailstate.otp,
                    email: state.email
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.verified) {
                        setEmailstate({ ...emailstate, verified: data.verified });
                    } else {
                        showAlert(data.message, 'danger');
                    }
                });
        }
    }

    const handelSubmit = (e) => {
        e.preventDefault();
        if (state.verified) {
            const { fname, lname, username, email, userType, phone, password, image, userverified } = state;
            console.log(fname, lname, username, email, userType, phone, password, image, userverified);
            fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    fname,
                    email,
                    userType,
                    username,
                    phone,
                    password,
                    base64: image,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data, "userRegister");
                    if (data.status === "ok") {
                        showAlert('Register Successful', 'success');
                        window.location.href = "./login";
                    } else {
                        showAlert('Registration Error', 'danger');
                    }
                });
        } else {
            showAlert('Please Verify Phone', 'danger');
        }
    };

    return (
        <div className="container" >
            <div className="row mt-5">
                <div id="recaptcha-container"></div>
                <div className="col-7 bg-light py-4 text-center">
                    <img src="images/gadgets_rebon-login.png" width="65%" alt="" />
                </div>
                <div className="col-5 pt-4">
                    <h3 className="text-center text-black font-weight-bold">Register</h3>
                    <h3 className="text-center text-black font-weight-bold">Welcome to Gadgets Reborn</h3>
                    {state.showAlert && (
                        <div className={`alert alert-${state.alertType} mt-3`} role="alert">
                            {state.alertMessage}
                        </div>
                    )}
                    <form onSubmit={handelSubmit}>
                        <div className="mb-3 d-none">
                            <input type="radio" checked="checked" className="form-control"
                                onChange={(e) => setState({ ...state, userType: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-secondary">Username</label>
                            <input type="text" className="form-control"
                                placeholder="Enter your username"
                                onChange={(e) => setState({ ...state, username: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-secondary">Email address</label>
                            <div className="d-flex">
                                <input type="email" className="form-control" placeholder="Enter your email"
                                    onChange={(e) => setState({ ...state, email: e.target.value })} />
                                <input type="button" disabled={emailstate.verified} onClick={handleEmailVerification} value={emailstate.verified ? "Verified" : "Verify"} className="ml-3 btn btn-primary" />
                            </div>
                        </div>
                        {(emailstate.otpsend && !emailstate.verified) ? <div className="mb-3">
                            <label className="form-label text-secondary">Email OTP</label>
                            <div className="d-flex">
                                <input type="number" className="form-control" placeholder="Enter otp"
                                    onChange={(e) => setEmailstate({ ...emailstate, otp: e.target.value })} />
                                <input type="button" value="Verify OTP" onClick={emailOtpChecker} className="ml-3 btn btn-primary px-3" />
                            </div>
                        </div> : ''}


                        <div className="mb-3">
                            <label className="form-label text-secondary">Phone</label>
                            <div className="d-flex">
                                <input type="number" className="form-control" placeholder="Enter your phone"
                                    onChange={(e) => changeMobile(e)} />
                                {state.verifyButton ?
                                    <input type="button" onClick={onSignInSubmit} value={state.verified ? "Verified" : "Verify"} className="ml-3 btn btn-primary" /> : null
                                }
                            </div>
                        </div>
                        {state.verifyOtp ?
                            <div className="mb-3">
                                <label className="form-label text-secondary">Phone OTP</label>
                                <div className="d-flex">
                                    <input type="number" className="form-control" placeholder="Enter otp"
                                        onChange={(e) => setState({ ...state, otp: e.target.value })} />
                                    <input type="button" value="Verify OTP" onClick={verifyCode} className="ml-3 btn btn-primary px-3" />
                                </div>
                            </div> : null}
                        <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <label className="form-label text-secondary">Password</label>
                            </div>
                            <input
                                type={showpass ? "text" : "password"}
                                className="form-control"
                                placeholder="Enter your password"
                                onChange={(e) => setState({ ...state, password: e.target.value })}
                            />
                            <span className="show_hide_pass">
                                <FontAwesomeIcon icon={showpass === true ? faEye : faEyeSlash} onClick={(e) =>
                                    (showpass === true) ? setShowpass(false) : setShowpass(true)} />
                            </span>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 d-block">Sign Up</button>
                    </form>
                    <p className="text-center text-secondary pt-4">Already have an account? <a href="/">Sign In</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;