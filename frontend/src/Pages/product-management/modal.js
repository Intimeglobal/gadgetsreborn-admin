import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../../Components/leftsidebar';
import Topbar from '../../Components/topbar';
import Breadcrumb from '../../Components/breadcrumb';
import Footer from '../../Components/footer';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

const AddModal = () => {
    const [modelname, setModelname] = useState('');
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(5);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [pageCount, setPageCount] = useState(0); // Initialize with 0
    const currentPage = useRef(0); // Initialize with 0
    // const [count, setCount] = useState(0);

    useEffect(() => {
        currentPage.current = 1;
        getAllModels();
        getPaginatedModel(0); // Initialize with page 0
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/modal-added', {
                modelname,
            });
            console.log(response.data, 'Model Added');
            if (response.data.status === 'ok') {
                displayAlert('Model Added Successfully', 'success');
                setModelname('');
                getAllModels();
            } else {
                displayAlert('Something Went Wrong', 'danger');
            }
        } catch (error) {
            console.error('Error:', error);
            displayAlert('Something Went Wrong', 'danger');
        }
    };

    const displayAlert = (message, type) => {
        setIsAlertVisible(true);
        setAlertMessage(message);
        setAlertType(type);

        // Hide the alert after a certain time (e.g., 5 seconds)
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 5000);
    };

    const getAllModels = async () => {
        try {
            const response = await axios.get('http://localhost:5000/models');
            setData(response.data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/models/${id}`);
            if (response.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePageClick = (e) => {
        console.log(e);
        currentPage.current = e.selected + 1;
        getPaginatedModel();
    };

    const getPaginatedModel = () => { // Pass page as a parameter
        fetch(`http://localhost:5000/paginatedModel?page=${currentPage.current}&limit=${limit}`, {
            method: "GET",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data, "userData");
                setPageCount(data.pageCount);
                setData(data.result)
            });
    };

    const changeLimit = () => {
        currentPage.current = 1;
        getPaginatedModel(currentPage.current);
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
                                <div className="col-xl-6 col-lg-6">
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">Add Model</h6>
                                        </div>
                                        <div className="card-body">
                                            {isAlertVisible && (
                                                <div className={`alert alert-${alertType} mt-3`} role="alert">
                                                    {alertMessage}
                                                </div>
                                            )}
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-3">
                                                    <label className="form-label text-secondary">Modal Name</label>
                                                    <input type="text" className="form-control"
                                                        placeholder="Enter Modal Name"
                                                        value={modelname}
                                                        onChange={(e) => setModelname(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <button type='submit' className="btn btn-primary">Add Product</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-6 col-lg-6">
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                            <h6 className="m-0 font-weight-bold text-primary">All Models</h6>
                                        </div>
                                        <div className="card-body">
                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>S.No.</th>
                                                        <th>Model</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.map((i, index) => {
                                                        return (
                                                            <tr key={i._id}>
                                                                <td>{index + 1}</td>
                                                                <td>{i.modelname}</td>
                                                                <td>
                                                                    <div className="row">
                                                                        <div className='col'>
                                                                            <button
                                                                                className="btn btn-link text-danger"
                                                                                onClick={() => handleDelete(i._id)}
                                                                            >
                                                                                <i className="fas fa-trash" />
                                                                            </button>
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
        </div>
    );
}

export default AddModal;