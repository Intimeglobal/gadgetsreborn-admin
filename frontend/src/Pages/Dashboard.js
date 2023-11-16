import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Components/leftsidebar';
import Topbar from '../Components/topbar';
import Breadcrumb from '../Components/breadcrumb';
import Footer from '../Components/footer';
import UsersProfile from './frontend/profile';
import axios from 'axios';

const Dashboard = () => {

    const [userData, setUserData] = useState("");
    const [admin, setAdmin] = useState(false);
    const [totalUsers, setTotalUsers] = useState(null);
    const [totalTechnicians, setTotalTechnicians] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/users", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
            }),
        }).then((res) => res.json())
            .then((data) => {
                // console.log(data, "userData");
                if (data.data.userType === "Admin") {
                    setAdmin(true);
                }

                setUserData(data.data);
                if (data.data === 'token expired') {
                    alert("Session End Login Again");
                    window.localStorage.clear();
                    window.location.href = "/";
                }
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/total-users')
            .then((response) => {
                setTotalUsers(response.data.totalUsers);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/total-technicians')
            .then((response) => {
                setTotalTechnicians(response.data.totalTechnicians);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);


    return admin ?
        <div>
            <div id="wrapper">

                <Sidebar />

                <div id="content-wrapper" className="d-flex flex-column">
                    <div class="box">
                        <svg width="1038" height="861" viewBox="0 0 1038 861" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="-19" y="-159.085" width="1119" height="1119" rx="65" transform="rotate(-21.7644 -19 -159.085)" fill="#FDDF02"></rect>
                        </svg>
                    </div>

                    <div id="content">

                        <Topbar />

                        <div className="container-fluid">

                            <Breadcrumb />

                            <div className="row">

                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-primary shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                        REGISTERED USERS</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{totalUsers}</div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-calendar fa-2x text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-info shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                                        REGISTERED TECHNICIANS
                                                    </div>
                                                    <div className="row no-gutters align-items-center">
                                                        <div className="col-auto">
                                                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">{totalTechnicians}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-success shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                        Earnings (Annual)</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">2150 AED</div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-dollar-sign fa-2x text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="col-xl-3 col-md-6 mb-4">
                                    <div className="card border-left-warning shadow h-100 py-2">
                                        <div className="card-body">
                                            <div className="row no-gutters align-items-center">
                                                <div className="col mr-2">
                                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                        PENDING REQUESTS</div>
                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">18</div>
                                                </div>
                                                <div className="col-auto">
                                                    <i className="fas fa-comments fa-2x text-gray-300" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="row">

                                <div className="col-xl-8 col-lg-7">
                                    <div className="card shadow mb-4">
                                        <div
                                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Recent Orders</h6>
                                        </div>
                                        <div className="card-body">
                                            <table className="table table-hover table-striped">
                                                <thead className="text-dark">
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Phone</th>
                                                        <th>Email</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-dark">
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                        <td>mohit@gmail.com</td>
                                                        <td>Pending</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                        <td>mohit@gmail.com</td>
                                                        <td>Pending</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                        <td>mohit@gmail.com</td>
                                                        <td>Pending</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                        <td>mohit@gmail.com</td>
                                                        <td>Pending</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                        <td>mohit@gmail.com</td>
                                                        <td>Pending</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                        <td>mohit@gmail.com</td>
                                                        <td>Pending</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                        <td>mohit@gmail.com</td>
                                                        <td>Pending</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-4 col-lg-5">
                                    <div className="card shadow mb-4">
                                        <div
                                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Orders In Progress</h6>
                                        </div>
                                        <div className="card-body">
                                            <table className="table table-hover table-striped">
                                                <thead className="text-dark">
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Phone</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-dark">
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                    </tr>
                                                    <tr>
                                                        <td>25546</td>
                                                        <td>John</td>
                                                        <td>0523891141</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>

                    <Footer />

                </div>

            </div>

            <Link className="scroll-to-top rounded" to="#page-top">
                <i className="fas fa-angle-up"></i>
            </Link>

            {/* Logout Modal */}
            <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                            <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                            <Link className="btn btn-primary" to="index.html">Logout</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        : <UsersProfile />
}

export default Dashboard