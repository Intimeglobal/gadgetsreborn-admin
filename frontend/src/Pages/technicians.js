import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Components/leftsidebar';
import Topbar from '../Components/topbar';
import Breadcrumb from '../Components/breadcrumb';
import Footer from '../Components/footer';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ReactPaginate from 'react-paginate';

export default function Technicians() {

    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [showModall, setShowModall] = useState(false);
    const [selectedTechnician, setselectedTechnician] = useState(null); // State to store selected user
    const [editedTechnician, seteditedTechnician] = useState({});
    const [pageCount, setPageCount] = useState(3);
    const currentPage = useRef();

    useEffect(() => {
        currentPage.current = 1;
        getAllTechnicians();
        getPaginatedTechnicians();
    }, [])

    const getAllTechnicians = () => {
        fetch("http://localhost:5000/getAllTechnicians", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                // console.log(data, "userData");
                setData(data.data);
            });
    };

    // Function to trim the last 6 digits from _id
    const trimUserId = (id) => {
        if (id && id.length >= 6) {
            return id.slice(-6);
        }
        return id;
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

    const handleOpenViewModal = (user) => {
        setselectedTechnician(user);
        setShowModall(true);
    };

    const handleOpenEditModal = (user) => {
        setselectedTechnician(user);
        seteditedTechnician(user); // Initialize the editedTechnician state with the selected user data
        setShowModal(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setShowModal(false);
        setShowModall(false);
    };

    const handleInputChange = (e) => {
        // Update the editedTechnician state when input fields change
        const { name, value } = e.target;
        seteditedTechnician({ ...editedTechnician, [name]: value });
    };

    const handlePageClick = (e) => {
        console.log(e);
        currentPage.current = e.selected + 1;
        getPaginatedTechnicians();
    };

    const getPaginatedTechnicians = () => {
        fetch(`http://localhost:5000/paginatedTechnicians?page=${currentPage.current}&limit=${limit}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "userData");
                setPageCount(data.pageCount);
                setData(data.result)
            });
    }

    const changeLimit = () => {
        currentPage.current = 1;
        getPaginatedTechnicians();
    }

    const handleUpdateTechnician = () => {
        // Assuming editedTechnician contains the _id and updated fname
        const { _id, fname } = editedTechnician;

        fetch("http://localhost:5000/updateTechnicians", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id,
                fname,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setShowModal(false);
                window.location.reload()
            });
    };


    return (
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

                                <div className="col-xl-12 col-lg-12">
                                    <div className="card shadow mb-4">
                                        <div
                                            className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">All Registered Technicians</h6>
                                        </div>
                                        <div className="card-body">
                                            <table className="table table-striped">
                                                <thead className="text-dark">
                                                    <tr>
                                                        <th width="8%">ID</th>
                                                        <th width="17%">Name</th>
                                                        <th width="13%">Phone</th>
                                                        <th width="22%">Email</th>
                                                        <th width="15%">Created on</th>
                                                        <th width="10%">Status</th>
                                                        <th width="10%">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-dark">
                                                    {data.map(i => {
                                                        return (
                                                            <tr key={i._id}>
                                                                <td>{trimUserId(i._id)}</td>
                                                                <td>{i.fname}</td>
                                                                <td>{i.phone}</td>
                                                                <td>{i.email}</td>
                                                                <td>{i.createdAt.Date}{formatDate(i.createdAt)}</td>
                                                                <td>Active</td>
                                                                <td>
                                                                    <div className="row">
                                                                        <div className="col-3">
                                                                            <i className="fas fa-eye text-dark cursor-pointer" onClick={() => handleOpenViewModal(i)} />
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <i className="fas fa-pencil-alt text-dark cursor-pointer" onClick={() => handleOpenEditModal(i)} />
                                                                        </div>
                                                                        <div className="col-3">
                                                                            <i className="fas fa-trash text-danger" />
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}

                                                </tbody>
                                            </table>
                                            <ReactPaginate
                                                breakLabel="..."
                                                nextLabel="next >"
                                                onPageChange={handlePageClick}
                                                pageRangeDisplayed={5}
                                                pageCount={pageCount}
                                                previousLabel="< previous"
                                                renderOnZeroPageCount={null}
                                                marginPagesDisplayed={2}
                                                containerClassName="pagination justify-content-center"
                                                pageClassName="page-item"
                                                pageLinkClassName="page-link"
                                                previousClassName="page-item"
                                                previousLinkClassName="page-link"
                                                nextClassName="page-item"
                                                nextLinkClassName="page-link"
                                                activeClassName="active"
                                                forcePage={currentPage.current - 1}
                                            />
                                            <input placeholder='Enter Limit' onChange={e => setLimit(e.target.value)} />
                                            <button type="button" onClick={changeLimit} className="btn btn-primary">Set Limit</button>
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
                    <Modal.Title className="modal_font">View User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTechnician && (
                        <div>
                            {/* Display user details in the modal */}
                            <p>ID: {trimUserId(selectedTechnician._id)}</p>
                            <p>Name: {selectedTechnician.fname}</p>
                            <p>Phone: {selectedTechnician.phone}</p>
                            <p>Email: {selectedTechnician.email}</p>
                            <p>Created on: {selectedTechnician.createdAt.Date}{formatDate(selectedTechnician.createdAt)}</p>
                            {/* Add form fields to edit user details here */}
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

            <Modal show={showModal} onHide={handleCloseModal} className="text-dark">
                <Modal.Header closeButton>
                    <Modal.Title className="modal_font">Edit User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editedTechnician && (
                        <div>
                            <form>
                                <div className="form-group text-dark">
                                    <label>ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="id"
                                        value={trimUserId(editedTechnician._id)}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fname"
                                        value={editedTechnician.fname}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        value={editedTechnician.phone}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        value={editedTechnician.email}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </div>
                            </form>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateTechnician}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}