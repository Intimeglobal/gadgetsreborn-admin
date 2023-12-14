import React, { Component } from 'react';

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            showAlert: false, // State variable to control the alert visibility
            alertMessage: "",
            alertType: "", // "success", "warning", "danger", etc.
        };
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit(e) {
        e.preventDefault();
        const { email, password } = this.state;
        console.log(email, password);
        fetch("http://localhost:5000/login-admin", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                email,
                password
            }),
        }).then((res) => res.json())
            .then((data) => {
                if (data.status === "ok") {
                    this.showAlert(data.message, "success");
                    // alert("Login Successful");
                    window.localStorage.setItem("token", data.token);
                    window.localStorage.setItem("loggedIn", true);
                    window.location.href = "./dashboard"
                }
            });
    }
    render() {
        return (
            <div>
                <div className="container">
                    <div className="row mt-5">
                        <div className="col-7 bg-light py-4 text-center">
                            <img src="images/gadgets_rebon-login.png" width="65%" alt="" />
                        </div>
                        <div className="col-5 pt-5 mt-3">
                            <h3 className="text-center text-black font-weight-bold">Welcome to Gadgets Reborn</h3>
                            <p className="text-secondary text-center">Please sign-in to your account and start the adventure</p>
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
                            <form onSubmit={this.handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="gadgetrebornemail" className="form-label text-secondary">Email address</label>
                                    <input type="email" className="form-control" id="gadgetrebornemail" placeholder="Enter your email"
                                        aria-describedby="emailHelp"
                                        onChange={(e) => this.setState({ email: e.target.value })} required />
                                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="text-left">
                                            <label htmlFor="gadgetrebornpassword" className="form-label text-secondary">Password</label>
                                        </div>
                                    </div>
                                    <input type="password" className="form-control" id="gadgetrebornpassword"
                                        placeholder="Enter your password"
                                        onChange={(e) => this.setState({ password: e.target.value })} required />
                                </div>

                                <button type="submit" className="btn btn-primary w-100 d-block">Sign In</button>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
