import React, { useEffect, useState } from 'react';
import Sidebar from '../../Components/leftsidebar';
import Topbar from '../../Components/topbar';
import Breadcrumb from '../../Components/breadcrumb';
import Footer from '../../Components/footer';
import { Link } from 'react-router-dom';

const AddProduct = () => {
    const [modalname, setModalName] = useState('');
    const [data, setData] = useState([]);
    const [productname, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [showAlert, setShowAlert] = useState(false); // State to control the alert visibility

    useEffect(() => {
        getAllModels();
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!modalname || !productname || !price || !status) {
            // If any field is empty, display an error alert
            setAlertMessage('Please fill out all fields.');
            setShowAlert(true);
            return; // Prevent form submission
        }
        console.log(modalname, productname, price, status);
        fetch("http://localhost:5000/product-added", {
            method: "POST",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                modalname,
                productname,
                price,
                status,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "Product Added");
                if (data.status === "ok") {
                    displayAlert("Product Added Successfully", "success");
                    setModalName('');
                    setProductName('');
                    setPrice('');
                    setStatus('');
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

    const getAllModels = () => {
        fetch("http://localhost:5000/models", {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data.data);
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
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Add Product</h6>
                                            <Link to="/add-model" className='btn btn-primary btn-sm'>Add Model</Link>
                                        </div>
                                        <div className="card-body">
                                            {isAlertVisible && (
                                                <div className={`alert alert-${alertType} mt-3 position-sticky`} role="alert">
                                                    {alertMessage}
                                                </div>
                                            )}
                                            {showAlert && (
                                                <div variant="danger" onClose={() => setShowAlert(false)} dismissible>
                                                    {alertMessage}
                                                </div>
                                            )}
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                    <label className="form-label text-secondary">Modal Name</label>
                                                    <select className="form-control" value={modalname} onChange={(e) => setModalName(e.target.value)}>
                                                        <option>Select Model</option>
                                                        {data.map(i => {
                                                            return (
                                                                <option>{i.modelname}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label text-secondary">Product Name</label>
                                                    <input type="text" className="form-control"
                                                        placeholder="Enter Product Name"
                                                        value={productname}
                                                        onChange={(e) => setProductName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label text-secondary">Price</label>
                                                    <input type="text" className="form-control"
                                                        placeholder="Enter Price"
                                                        value={price}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label text-secondary">Status</label>
                                                    <select className="form-control" value={status} required onChange={(e) => setStatus(e.target.value)}>
                                                        <option>Select Status</option>
                                                        <option value="Out of Stock">Out of Stock</option>
                                                        <option value="In Stock">In Stock</option>
                                                    </select>
                                                </div>
                                                <div className="mb-3">
                                                    <button type='submit' className="btn btn-primary">Add Product</button>
                                                </div>
                                            </form>
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
}

export default AddProduct;
