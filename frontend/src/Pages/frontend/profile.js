import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/leftsidebar';
import Topbar from '../../Components/topbar';
import Breadcrumb from '../../Components/breadcrumb';
import Footer from '../../Components/footer';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const UsersProfile = () => {
    const [userData, setUserData] = useState({});
    const [editedUser, setEditedUser] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLoginUser();
    }, []);

    function convertToBase64(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            console.log(reader.result); // base64-encoded string
            setImage(reader.result);
        };
        reader.onerror = (error) => {
            console.log("Error: ", error);
        };
    }

    const trimUserId = (id) => {
        if (id && id.length >= 6) {
            return id.slice(-6);
        }
        return id;
    }

    const getLoginUser = () => {
        fetch("http://localhost:5000/getloginuserdata", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                token: window.localStorage.getItem("token"),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "userData");
                setUserData(data.data);
                setLoading(false);
                setImage(`data:image/png;base64,${data.data.image}`);
            })
            .catch((error) => {
                console.error("Error fetching user data: ", error);
            });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleOpenEditModal = (user) => {
        setEditedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleUpdateUser = () => {
        const formData = new FormData();
        formData.append("_id", editedUser._id);
        formData.append("fname", editedUser.fname);
        formData.append("instagram", editedUser.instagram);
        formData.append("facebook", editedUser.facebook);
        formData.append("address", editedUser.address);
        formData.append("role", editedUser.role);

        if (image !== "") {
            formData.append("image", dataURLtoFile(image, "image.png"));
        }

        fetch("http://localhost:5000/updateUser", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setShowModal(false);
                window.location.reload();
            });
    }

    function dataURLtoFile(dataurl, filename) {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    return (
        <div>
            <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <Topbar />
                        <div className="container-fluid">
                            <Breadcrumb />
                            <div className="row">
                                <div className="col-xl-4 col-lg-4">
                                    <div className="card shadow mb-4">
                                        <div className="card-body">
                                            <div className="edit_icon text-right">
                                                <i
                                                    className="fas fa-pencil-alt text-dark cursor-pointer"
                                                    onClick={() => handleOpenEditModal(userData)}
                                                />
                                            </div>
                                            <div className="profile-userpic text-center my-4 text-dark">
                                                <img
                                                    alt=""
                                                    src={`data:image/png;base64,${userData.image}`}
                                                    width="25"
                                                    height="25"
                                                    className="img-responsive img-fluid rounded-circle img-thumbnail"
                                                />
                                                <h4 className="font-weight-bold pt-3">{userData.fname}</h4>
                                                <p className="mb-0">{userData.role}</p>
                                                <p>{userData.address}</p>
                                                <Link className="btn btn-primary px-4" to="#">
                                                    Message
                                                </Link>
                                            </div>
                                            <hr />
                                            <div className="user_profile_details">
                                                {userData && userData.phone ? (
                                                    <div className="row py-2">
                                                        <div className="col">Phone</div>
                                                        <div className="col text-left">{userData.phone}</div>
                                                    </div>
                                                ) : (
                                                    <div class="gradient element2 mb-1">
                                                    </div>
                                                )}
                                                {userData && userData.email ? (
                                                    <div className="row py-2">
                                                        <div className="col">Email</div>
                                                        <div className="col text-left">{userData.email}</div>
                                                    </div>
                                                ) : (
                                                    <div class="gradient element2 mb-1">
                                                    </div>
                                                )}
                                                {userData && userData.instagram ? (
                                                    <div className="row py-2">
                                                        <div className="col">Instagram</div>
                                                        <div className="col text-left">{userData.instagram}</div>
                                                    </div>
                                                ) : (
                                                    <div class="gradient element2 mb-1">
                                                    </div>
                                                )}
                                                {userData && userData.facebook ? (
                                                    <div className="row py-2">
                                                        <div className="col">Facebook</div>
                                                        <div className="col text-left">{userData.facebook}</div>
                                                    </div>
                                                ) : (
                                                    <div class="gradient element2">
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-8 col-lg-8">
                                    <div className="card shadow">
                                        <div className="card-body pb-5 text-dark">
                                            <h3 className="font-weight-bold">Job Board</h3>
                                            <div className="panel-body text-dark">
                                                <table className="table table-striped text-dark">
                                                    <thead>
                                                        <tr>
                                                            <th>Job ID</th>
                                                            <th>Name</th>
                                                            <th>Phone</th>
                                                            <th>IMEI</th>
                                                            <th>Job Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>25564</td>
                                                            <td>John Smith</td>
                                                            <td>0523891141</td>
                                                            <td>545568984564575</td>
                                                            <td>In progress</td>
                                                            <td>
                                                                <div className="row">
                                                                    <div className="col-3">
                                                                        <Link to="#">
                                                                            {/* <i className="fas fa-eye text-dark" /> */}
                                                                        </Link>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <Link to="#">
                                                                            {/* <i className="fas fa-pencil-alt text-dark"></i> */}
                                                                        </Link>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <Link to="#">
                                                                            {/* <i className="fas fa-trash text-danger"></i> */}
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {/* Add more job table rows here */}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} className="text-dark">
                <Modal.Header closeButton>
                    <Modal.Title className="modal_font">Edit User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editedUser && (
                        <div>
                            <form>
                                <div className="form-group text-dark">
                                    <label>ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="id"
                                        value={trimUserId(editedUser._id)}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fname"
                                        value={editedUser.fname}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group text-dark">
                                    <label>User Image</label>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        name="image"
                                        onChange={convertToBase64}
                                    />
                                    {image === "" || image === null ? (
                                        ""
                                    ) : (
                                        <img width={100} height={100} src={image} alt={image} />
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        value={editedUser.phone}
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
                                        value={editedUser.email}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="role"
                                        value={editedUser.role}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        value={editedUser.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Instagram</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="instagram"
                                        value={editedUser.instagram}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Facebook</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="facebook"
                                        value={editedUser.facebook}
                                        onChange={handleInputChange}
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
                    <Button variant="primary" onClick={handleUpdateUser}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UsersProfile;
