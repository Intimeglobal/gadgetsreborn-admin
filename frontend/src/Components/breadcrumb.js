import React from 'react';
import { Link } from 'react-router-dom';

function breadcrumb() {
    const path = window.location.pathname;
    const pageName = path.substring(path.lastIndexOf('/') + 1);
    return (
        <div>
            <div className="align-items-center justify-content-between mb-4">
                <div className="row2 d-flex">
                    <div className="col_pagetitle">
                        <h3
                            className="w-100 pr-4 text-capitalize h3 mb-0 text-gray-800 font-weight-bold border border-top-0 border-left-0 border-bottom-0 border-dark">
                            {pageName}</h3>
                    </div>
                    <div className="col_pagetitle2 pl-4 d-flex pt-1">
                        <Link to="/dashboard">
                            <i className="fas fa-home pr-3" />
                        </Link>
                        <i className="fas fa-chevron-right pr-3 pt-1 text-dark" />
                        <span className="text-dark text-capitalize">{pageName}</span>
                    </div>
                </div>

                {/* <a href=" #" className="d-sm-inline-block btn btn-sm btn-primary shadow-sm"> Add New User</a> */}
            </div>


        </div>
    )
}

export default breadcrumb