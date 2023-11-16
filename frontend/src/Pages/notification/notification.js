import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/leftsidebar';
import Topbar from '../../Components/topbar';
import Breadcrumb from '../../Components/breadcrumb';
import Footer from '../../Components/footer';

const Notification = () => {
    const [user, setUser] = useState('');
    const [notificationtype, setNotificationtype] = useState('');
    const [notification, setNotification] = useState('');
    const [data, setData] = useState([]);
    const [datanotification, setDatanotification] = useState([]);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [editedUser, seteditedUser] = useState({});


    useEffect(() => {
        getAllUsers();
        getAllNotifications();
    }, []);

    const getAllUsers = () => {
        fetch('http://localhost:5000/getAllUser', {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const getAllNotifications = () => {
        fetch("http://localhost:5000/allnotifications", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((datanotification) => {
                console.log(datanotification, "userData");
                setDatanotification(datanotification.data);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user || !notificationtype || !notification) {
            // If any field is empty, display an error alert
            setAlertMessage('Please fill out all fields.');
            return; // Prevent form submission
        }
        console.log(user, notificationtype, notification);
        fetch("http://localhost:5000/notifications-added", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                user,
                notificationtype,
                notification,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Notification Added");
                if (data.status === "ok") {
                    displayAlert("Notification Successfully", "success");
                    setUser('');
                    setNotificationtype('');
                    setNotification('');
                    window.location.reload();
                } else {
                    displayAlert("Something Went Wrong", "danger");
                }
            });
    }

    const displayAlert = (message, type) => {
        setIsAlertVisible(true);
        setAlertMessage(message);
        setAlertType(type);
    }

    const getUserName = (userId) => {
        const user = data.find((item) => item._id === userId);
        return user ? user.fname : 'Unknown'; // Return 'Unknown' if the user is not found
    }

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
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Send Notification</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-xl-6 col-lg-6">
                                                    <ul className="nav nav-tabs">
                                                        <li className="nav-item">
                                                            <a className="nav-link active px-4" data-bs-toggle="tab" href="#home">Single User</a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a className="nav-link px-4" data-bs-toggle="tab" href="#menu1">Multiple User</a>
                                                        </li>
                                                    </ul>

                                                    <div className="tab-content bg-light">
                                                        {isAlertVisible && (
                                                            <div className={`alert alert-${alertType}`} role="alert">
                                                                {alertMessage}
                                                            </div>
                                                        )}
                                                        <div className="tab-pane container active py-4" id="home">
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col-12 py-3">
                                                                        <label htmlFor="userSelect">Select User</label>
                                                                        <select
                                                                            id="userSelect"
                                                                            value={user}
                                                                            className="form-control"
                                                                            onChange={(e) => setUser(e.target.value)}
                                                                        >
                                                                            <option>Select User</option>
                                                                            {data.map((item, index) => (
                                                                                <option key={index} value={item._id} onClick={() => setUser(item)}>
                                                                                    {index + 1}. {item.fname}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-12 py-3">
                                                                        <label htmlFor="notificationTypeSelect">Notification Type</label>
                                                                        <select
                                                                            id="notificationTypeSelect"
                                                                            className="form-control"
                                                                            onChange={(e) => setNotificationtype(e.target.value)}
                                                                        >
                                                                            <option>Notification Type</option>
                                                                            <option value="Promotional">Promotional</option>
                                                                            <option value="Service">Service</option>
                                                                            <option value="Payment">Payment</option>
                                                                            <option value="Feedback">Feedback</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-12 py-3">
                                                                        <label htmlFor="notificationMessage">Type Notification Message</label>
                                                                        <textarea
                                                                            id="notificationMessage"
                                                                            rows="8"
                                                                            className="form-control"
                                                                            placeholder="Type Notification Message"
                                                                            onChange={(e) => setNotification(e.target.value)}
                                                                        ></textarea>
                                                                    </div>
                                                                    <div className="col-12 py-3">
                                                                        <button type='submit' className="btn btn-primary" onClick={handleSubmit}>
                                                                            Update User Notification
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                        {/* <div className="tab-pane container fade py-4" id="menu1">
                                                            <form>
                                                                <div className="row">
                                                                    <div className="col-12 py-3">
                                                                        <label htmlFor="multiUserSelect">Select Users</label>
                                                                        <select
                                                                            id="multiUserSelect"
                                                                            multiple
                                                                            className="form-control"
                                                                            onChange={(e) => setUser(e.target.value)}
                                                                        >
                                                                            {data.map((item, index) => (
                                                                                <option key={index}>{item.user}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-12 py-3">
                                                                        <label htmlFor="notificationTypeSelect">Notification Type</label>
                                                                        <select
                                                                            id="notificationTypeSelect"
                                                                            className="form-control"
                                                                            onChange={(e) => setNotificationtype(e.target.value)}
                                                                        >
                                                                            <option>Notification Type</option>
                                                                            <option value="Promotional">Promotional</option>
                                                                            <option value="Service">Service</option>
                                                                            <option value="Payment">Payment</option>
                                                                            <option value="Feedback">Feedback</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-12 py-3">
                                                                        <label htmlFor="notificationMessage">Type Notification Message</label>
                                                                        <textarea
                                                                            id="notificationMessage"
                                                                            rows="8"
                                                                            className="form-control"
                                                                            placeholder="Type Notification Message"
                                                                            onChange={(e) => setNotification(e.target.value)}
                                                                        ></textarea>
                                                                    </div>
                                                                    <div className="col-12 py-3">
                                                                        <button type='submit' className="btn btn-primary">Send Notification</button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div> */}
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 col-lg-6">
                                                    <div className="card mb-4">
                                                        <div className="card-body">
                                                            <h5 className="text-dark font-weight-bold mb-4">Notifications</h5>
                                                            <table className="table table-striped table-hover">
                                                                <thead>
                                                                    <tr>
                                                                        <th>S.No.</th>
                                                                        <th>User</th>
                                                                        <th>Notification Type</th>
                                                                        <th>Notification</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {datanotification.map((i, index) => {
                                                                        return (
                                                                            <tr key={i._id}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{getUserName(i.user)}</td>
                                                                                <td>{i.notificationtype}</td>
                                                                                <td>{i.notification}</td>
                                                                            </tr>
                                                                        )
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
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
        </div>
    );
};

export default Notification;
