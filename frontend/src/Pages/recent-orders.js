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
    }, []);


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


    return (
        <div>

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
                                                        <th width="8%">ID</th>
                                                        {/* <th width="2%">Image</th> */}
                                                        <th width="10%">He/She Like to Do</th>
                                                        <th width="10%">Phone</th>
                                                        <th width="10%">Created on</th>
                                                        <th width="10%">Status</th>
                                                        <th width="10%">Date/Time</th>
                                                        {/* <th width="20%">Technician Name</th> */}
                                                        <th width="10%">Dignose</th>
                                                        <th width="10%">Assign To</th>
                                                    </tr>
                                                </thead>

                                                <tbody className="text-dark">
                                                    {loading ?
                                                        <div class="w-100 gradient element2">
                                                        </div>
                                                        : (orders.length > 0) && orders.map((order) => {
                                                            return (
                                                                <tr key={order.orderId}>
                                                                    <td>
                                                                        <a href="#" onClick={() => handleOpenViewModal(order)}>{order.orderId}
                                                                        </a>
                                                                    </td>
                                                                    <td>{order.whatdoyouliketodo}</td>
                                                                    <td>{order.phone}</td>
                                                                    <td>{order.pickupdrop}</td>
                                                                    <td>{order.orderstatus}</td>
                                                                    <td>{order.pickupdate} {order.pickuptime}</td>
                                                                    {/* <td>{order.technicianAllotted}</td> */}
                                                                    <td>{order.diagnoseDone}</td>
                                                                    <td>
                                                                        <select>
                                                                            <option>Select Option</option>
                                                                            <option>Technician Name</option>
                                                                        </select>
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
                                <p className="text-dark">Order ID: {selectedUser.orderId}</p>
                                <p className="text-dark">what he/she like to do: {selectedUser.whatdoyouliketodo}</p>
                                <p className="text-dark">Order Price: {selectedUser.orderprice}</p>
                                <p className="text-dark">Due Amount: {selectedUser.dueAmount}</p>
                                <p className="text-dark">Pick/Drop: {selectedUser.pickupdrop}</p>
                                <p className="text-dark">Technician Name: {selectedUser.technicianAllotted}</p>
                                <p className="text-dark">Diagnose: {selectedUser.diagnoseDone}</p>
                                <p className="text-dark">Diagnose Date: {selectedUser.diagnosticsdate.Date}{formatDate(selectedUser.diagnosticsdate)} - {selectedUser.diagnosticsdate.Date}{formatTime(selectedUser.diagnosticsdate)}</p>
                                <p className="text-dark">Payment Details: {selectedUser.paymentDetails.transactionId}</p>
                                <p className="text-dark">Order Status: {selectedUser.orderstatus}</p>
                                <p className="text-dark">Order Date/Time: {selectedUser.lastorderDate.Date}{formatDate(selectedUser.lastorderDate)} - {selectedUser.lastorderDate.Date}{formatTime(selectedUser.lastorderDate)}</p>
                            </div>
                            <div className="col-md-12 text-dark">
                                <h4 className="text-dark">Work</h4>
                                <p className="text-dark">Tasks: {selectedUser.work}</p>
                            </div>
                            <div className="col-md-12 text-dark">
                                <h4 className="text-dark">User Details</h4>
                                <p className="text-dark">User Email: {selectedUser.email}</p>
                                <p className="text-dark">User Phone: {selectedUser.phone}</p>
                                <p className="text-dark">Address: {selectedUser.address.houseno} {selectedUser.address.streetaddress}</p>
                                <p className="text-dark">Pick Up Date/Time: {selectedUser.pickupdate} - {selectedUser.pickuptime}</p>
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