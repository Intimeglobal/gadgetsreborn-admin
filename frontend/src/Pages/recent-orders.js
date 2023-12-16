import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Components/leftsidebar';
import Topbar from '../Components/topbar';
import Breadcrumb from '../Components/breadcrumb';
import Footer from '../Components/footer';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ReactPaginate from 'react-paginate';

export default function Users() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModall, setShowModall] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // State to store selected user
    const [technicians, setTechnicians] = useState([]);
    const [selectedTechnician, setselectedTechnician] = useState("");

    const handleOpenViewModal = (order) => {
        setSelectedUser(order);
        setShowModall(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setShowModall(false);
    };

    useEffect(() => {

        const token = window.localStorage.getItem("token");
        if (!token) {
            alert("Session End Login Again");
            window.localStorage.clear();
            window.location.href = "/";
        }

        getAllOrders();
        getAllTechnicians();
    }, []);

    const getAllOrders = async () => {
        fetch("http://localhost:5000/fetch-all-orders", {
            method: "GET",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": "bearer " + window.localStorage.getItem("token"),
            },
        }).then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.status === "ok") {
                    setOrders(data.data);
                    setLoading(false);
                }
            });
    }


    const formatDate = (createdAt) => {
        if (createdAt) {
            const date = new Date(createdAt);
            const day = date.getDate();
            const month = date.getMonth() + 1; // Months are 0-based
            const year = date.getFullYear();

            // Ensure day and month have two digits by adding leading zeros if needed
            const formattedDay = day < 10 ? `0${day}` : day;
            const formattedMonth = month < 10 ? `0${month}` : month;

            return `${formattedDay}/${formattedMonth}/${year}`;
        }
        return createdAt;
    }

    const formatTime = (createdAt) => {
        if (createdAt) {
            const date = new Date(createdAt);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            // const seconds = date.getSeconds();

            // Ensure hours, minutes, and seconds have two digits by adding leading zeros if needed
            const formattedHours = hours < 10 ? `0${hours}` : hours;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            // const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

            return `${formattedHours}:${formattedMinutes}`;
        }
        return createdAt;
    };

    const getAllTechnicians = () => {
        fetch("http://localhost:5000/getAllVerifiedTechnicians", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": "bearer " + window.localStorage.getItem("token"),
            }
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data, "userData");
                setTechnicians(data.data);
            });
    };

    const alloteTechnician = async (id) => {
        console.log(selectedTechnician, ".......s" + id);
        fetch("http://localhost:5000/allotTechnician", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": "bearer " + window.localStorage.getItem("token"),
            },
            body: JSON.stringify({ technicianID: selectedTechnician, orderID: id })
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
            });

        getAllOrders();
    };

    return (
        <div>
            {console.log(selectedTechnician)}
            <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div className="box">
                        <svg width="1038" height="861" viewBox="0 0 1038 861" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="-19" y="-159.085" width="1119" height="1119" rx="65" transform="rotate(-21.7644 -19 -159.085)" fill="#FDDF02"></rect>
                        </svg>
                    </div>
                    <div id="content">
                        <Topbar />
                        <div className="container-fluid">
                            <Breadcrumb />
                            <div className="row">
                                <div className="col-xl-12 col-lg-12">
                                    <div className="card shadow mb-4">
                                        <div
                                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">All Orders</h6>
                                        </div>
                                        <div className="card-body">


                                            <table className="table table-striped">
                                                <thead className="text-dark">
                                                    <tr>
                                                        <th>ID</th>
                                                        {/* <th width="2%">Image</th> */}
                                                        <th>Job</th>
                                                        <th>Phone</th>
                                                        <th>Status</th>
                                                        <th>Date/Time</th>
                                                        <th>Technician Name</th>
                                                        <th>Dignose</th>
                                                        <th>Assign To</th>
                                                    </tr>
                                                </thead>

                                                <tbody className="text-dark">
                                                    {loading ?
                                                        <tr>
                                                            <td colspan="8">
                                                                <div class="d-block w-100 gradient element2">
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        : (orders.length > 0) && orders.map((order) => {
                                                            return (
                                                                <tr key={order.orderId}>
                                                                    <td>
                                                                        <a href="#" onClick={() => handleOpenViewModal(order)}>{order.orderId}
                                                                        </a>
                                                                    </td>
                                                                    <td>{order.whatdoyouliketodo}</td>
                                                                    <td>{order.phone}</td>
                                                                    <td>{order.orderstatus}</td>
                                                                    <td>{order.pickupdate} {order.pickuptime}</td>
                                                                    <td>{order.technicianAllotted}</td>
                                                                    <td>{order.diagnoseDone}</td>
                                                                    <td>
                                                                        {order.technicianAllotted ? (
                                                                            <div className="btn btn-success">Allotted</div>
                                                                        ) : (
                                                                            <>
                                                                                <select onChange={(e) => setselectedTechnician(e.target.value)}>
                                                                                    <option>Select Option</option>
                                                                                    {(technicians.length > 0) ? technicians.map((verifiedTechy) => (
                                                                                        <option value={verifiedTechy._id}>{verifiedTechy.email}</option>
                                                                                    )) : ""}
                                                                                </select>
                                                                                <Link to="#" className="btn btn-warning" onClick={() => alloteTechnician(order.orderId)}>
                                                                                    Allote
                                                                                </Link>
                                                                            </>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }

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
                <i className="fas fa-angle-up" />
            </Link>


            <Modal show={showModall} onHide={handleCloseModal} className="text-dark">
                <Modal.Header closeButton>
                    <Modal.Title className="modal_font">Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div className="row">
                            <div className="col-md-12 text-dark">
                                <table className="table table-striped text-capitalize">
                                    <thead>
                                        <tr>
                                            <th width="50%"></th>
                                            <th width="50%"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-dark">
                                        <tr>
                                            <td>Order ID:</td>
                                            <td>{selectedUser.orderId}</td>
                                        </tr>
                                        <tr>
                                            <td>what he/she like to do:</td>
                                            <td>{selectedUser.whatdoyouliketodo}</td>
                                        </tr>
                                        <tr>

                                            <td>Order Price:</td>
                                            <td>{selectedUser.orderprice}</td>
                                        </tr>
                                        <tr>
                                            <td>Due Amount: </td>
                                            <td>{selectedUser.dueAmount}</td>
                                        </tr>

                                        <tr>
                                            <td>Technician Name:</td>
                                            <td>{selectedUser.technicianAllotted}</td>
                                        </tr>
                                        <tr>
                                            <td>Diagnose:</td>
                                            <td>{selectedUser.diagnoseDone}</td>
                                        </tr>
                                        <tr>
                                            <td>Diagnose Date:</td>
                                            <td>{selectedUser.diagnosticsdate.Date}{formatDate(selectedUser.diagnosticsdate)} - {selectedUser.diagnosticsdate.Date}{formatTime(selectedUser.diagnosticsdate)}</td>
                                        </tr>
                                        <tr>
                                            <td>Payment Details:</td>
                                            <td>{selectedUser.paymentDetails.transactionId}</td>
                                        </tr>
                                        <tr>
                                            <td>Order Status:</td>
                                            <td>{selectedUser.orderstatus}</td>
                                        </tr>
                                        <tr>
                                            <td>Order Date/Time:</td>
                                            <td>{selectedUser.lastorderDate.Date}{formatDate(selectedUser.lastorderDate)} - {selectedUser.lastorderDate.Date}{formatTime(selectedUser.lastorderDate)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-12 text-dark">
                                <table className="table table-striped text-capitalize">
                                    <thead>
                                        <tr>
                                            <th width="50%"><h4 className="text-dark">Work</h4></th>
                                            <th width="50%"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-dark">
                                        <tr>
                                            <td>Tasks:</td>
                                            <td>{selectedUser.work}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-12 text-dark">
                                <table className="table table-striped text-capitalize">
                                    <thead>
                                        <tr>
                                            <th width="50%"><h4 className="text-dark">User Details</h4></th>
                                            <th width="50%"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-dark">
                                        <tr>
                                            <td>User Email: </td>
                                            <td>{selectedUser.email}</td>
                                        </tr>
                                        <tr>
                                            <td>User Phone: </td>
                                            <td>{selectedUser.phone}</td>
                                        </tr>
                                        <tr>
                                            <td>Address: </td>
                                            <td>{selectedUser.address.houseno} {selectedUser.address.streetaddress}</td>
                                        </tr>
                                        <tr>
                                            <td>Pick/Drop:</td>
                                            <td>{selectedUser.pickupdrop}</td>
                                        </tr>
                                        <tr>
                                            <td>Pick Up Date/Time:</td>
                                            <td>{selectedUser.pickupdate} - {selectedUser.pickuptime}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={handleCloseModal}>
                        Close
                    </button>
                    {/* Add a button to save updated user details */}
                    {/* Implement logic to update user details here */}
                </Modal.Footer>
            </Modal>
        </div>
    )
}