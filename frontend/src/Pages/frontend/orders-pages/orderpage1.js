import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';

function OrderPage1() {
    const [userData, setUserData] = useState({});
    const [editedUser, setEditedUser] = useState({
        _id: '', // Make sure you initialize _id or other necessary fields
        whatdoyouliketodo: '',
        orderId: '',
        orderprice: '',
        totalPrice: '',
        serialnumber: '',
        modal: '',
        color: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        getLoginUser();
    }, []);

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
            })
            .catch((error) => {
                setError(error.toString()); // Convert the error object to a string for better error messages
                console.error("Fetch error: ", error);
            });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleUpdateUsermobile = () => {
        const formData = new FormData();
        for (const key in editedUser) {
            formData.append(key, editedUser[key]);
        }

        fetch("http://localhost:5000/updateusermobile", {
            method: "POST",
            body: formData,
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log(data);
                window.location.reload();
            })
            .catch((error) => {
                setError(error.message); // Set error state
                console.error("Fetch error: ", error);
            });
    }

    return (
        <div>
            {error && <div>Error: {error}</div>}

            {editedUser && (
                <div>
                    <form>
                        <div className="form-group text-dark">
                            <label>What do you like to do</label>
                            <input
                                type="text"
                                className="form-control"
                                name="whatdoyouliketodo"
                                value={editedUser.whatdoyouliketodo}
                                onChange={handleInputChange}
                            />
                        </div>
                        {/* Add similar input fields for other properties */}
                    </form>
                </div>
            )}
            <Button variant="primary" onClick={handleUpdateUsermobile}>
                Update
            </Button>
        </div>
    )
}

export default OrderPage1;
