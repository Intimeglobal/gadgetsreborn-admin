import React from 'react';
import { Link } from 'react-router-dom';


function leftsidebar() {

    const logOut = () => {
        window.localStorage.clear();
        window.location.href = "./login";
    };

    return (
        <div className="bg-gadgets-orange">
            <ul className="navbar-nav sidebar sidebar-dark accordion" id="accordionSidebar">

                <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <img src="images/logo.png" alt="" className="img-fluid" />
                    </div>
                    <div className="sidebar-gadgets-text mx-3">Gadgets Reborn</div>
                </Link>

                <hr className="sidebar-divider my-0" />

                <li className="nav-item active">
                    <Link className="nav-link" to="/dashboard">
                        <i className="fas fa-fw fa-tachometer-alt" />
                        <span>Dashboard</span></Link>
                </li>

                <hr className="sidebar-divider" />


                <li className="nav-item">
                    <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseUser"
                        aria-expanded="true" aria-controls="collapseUser">
                        <i className="fas fa-fw fa-cog" />
                        <span>Users Management</span>
                    </Link>
                    <div id="collapseUser" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                        <div className="bg-orange py-2 collapse-inner rounded">
                            <Link className="collapse-item font-weight-bold" to="/users">Users</Link>
                            <Link className="collapse-item font-weight-bold" to="/technicians">Technicians</Link>
                        </div>
                    </div>
                </li>

                <li className="nav-item">
                    <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseOrders"
                        aria-expanded="true" aria-controls="collapseOrders">
                        <i className="fas fa-fw fa-wrench" />
                        <span>Order Management</span>
                    </Link>
                    <div id="collapseOrders" className="collapse" aria-labelledby="headingUtilities"
                        data-parent="#accordionSidebar">
                        <div className="bg-orange py-2 collapse-inner rounded">
                            <Link className="collapse-item font-weight-bold" to="recent-orders.html">Recent Orders</Link>
                            <Link className="collapse-item font-weight-bold" to="technician-allocated.html">Technician
                                Allocated</Link>
                            <Link className="collapse-item font-weight-bold" to="complete-orders.html">Complete Orders</Link>
                        </div>
                    </div>
                </li>

                <hr className="sidebar-divider" />
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseCategoryproduct"
                        aria-expanded="true" aria-controls="collapseCategoryproduct">
                        <i className="fas fa-fw fa-folder" />
                        <span>Category & Products</span>
                    </Link>
                    <div id="collapseCategoryproduct" className="collapse" aria-labelledby="headingPages"
                        data-parent="#accordionSidebar">
                        <div className="bg-orange py-2 collapse-inner rounded">
                            <Link className="collapse-item font-weight-bold" to="/all-products">All Products</Link>
                            <Link className="collapse-item font-weight-bold" to="/add-product">Add Product</Link>
                        </div>
                    </div>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to="/notification">
                        <i className="fas fa-fw fa-folder" />
                        <span>Notifications</span>
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link collapsed" to="#" data-toggle="collapse" data-target="#collapseWarrenty"
                        aria-expanded="true" aria-controls="collapseWarrenty">
                        <i className="fas fa-fw fa-wrench" />
                        <span>Warranty Management</span>
                    </Link>
                    <div id="collapseWarrenty" className="collapse" aria-labelledby="headingUtilities"
                        data-parent="#accordionSidebar">
                        <div className="bg-orange py-2 collapse-inner rounded">
                            <Link className="collapse-item font-weight-bold" to="warranty.html">Recent Orders</Link>
                        </div>
                    </div>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to="wallet.html">
                        <i className="fas fa-fw fa-table" />
                        <span>Wallet</span></Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link" to="settings.html">
                        <i className="fas fa-fw fa-chart-area" />
                        <span>Settings</span></Link>
                </li>

                <li className="nav-item">
                    <Link onClick={logOut} className="nav-link" to="#" data-toggle="modal" data-target="#logoutModal">
                        <i className="fas fa-sign-out-alt" />
                        <span>Log Out</span>
                    </Link>
                </li>



                <hr className="sidebar-divider d-none d-md-block" />

                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle"></button>
                </div>
                <hr className="sidebar-divider" />
                <p className="text-dark text-center">App Version 1.0.1</p>

            </ul>
        </div>
    )
}

export default leftsidebar