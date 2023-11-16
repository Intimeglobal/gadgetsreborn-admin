import React, { Component } from 'react'

export default class Reset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        const { email } = this.state;
        console.log(email);
        fetch("http://localhost:5000/forgot-password", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                email,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "users");
                alert(data.status);
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
                        <div className="col-5 pt-4">
                            <h2 className="text-center text-dark font-weight-bold">Forgot Password</h2>

                            <form onSubmit={this.handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="gadgetrebornemail" className="form-label text-secondary">Email address</label>
                                    <input type="email" className="form-control" onChange={(e) => this.setState({ email: e.target.value })} id="gadgetrebornemail" placeholder="Enter your email"
                                        aria-describedby="emailHelp" required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 d-block">Forgot Password</button>
                            </form>
                            <p className="text-center text-secondary pt-4">Rembember Password? <a href="/">Sign In</a></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}