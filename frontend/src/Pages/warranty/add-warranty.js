import React, { useState } from 'react';
import axios from 'axios';

function WarrantyForm() {
    const [warrantyname, setWarrantyname] = useState('');
    const [warrantyprice, setWarrantyprice] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!warrantyname || !warrantyprice) {
            displayAlert('Please fill out all required fields.', 'danger');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/warrantyadded', {
                warrantyname,
                warrantyprice,
            });

            if (response.data.status === 'ok') {
                displayAlert('Warranty Added Successfully', 'success');
                setWarrantyname('');
                setWarrantyprice('');
            } else {
                displayAlert('Something Went Wrong', 'danger');
            }
        } catch (error) {
            console.log(error);
            displayAlert('Something Went Wrong', 'danger');
        }
    };

    const displayAlert = (message, type) => {
        setIsAlertVisible(true);
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => {
            setIsAlertVisible(false);
        }, 5000); // Hide the alert after 5 seconds
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Warranty Name"
                value={warrantyname}
                onChange={(e) => setWarrantyname(e.target.value)}
            />
            <input
                type="number"
                placeholder="Warranty Price"
                value={warrantyprice}
                onChange={(e) => setWarrantyprice(e.target.value)}
            />
            <button type="submit">Add Warranty</button>
            {isAlertVisible && (
                <div className={`alert alert-${alertType}`} role="alert">
                    {alertMessage}
                </div>
            )}
        </form>
    );
}

export default WarrantyForm;
