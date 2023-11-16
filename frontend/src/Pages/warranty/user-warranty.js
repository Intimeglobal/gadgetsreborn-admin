// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const PurchaseWarranty = ({ warranties }) => {
//     const [selectedWarranty, setSelectedWarranty] = useState('');
//     const [message, setMessage] = useState('');
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         getAllWarranty();
//     }, []);

//     const handlePurchase = async () => {
//         if (!selectedWarranty) {
//             setMessage('Please select a warranty');
//             return;
//         }

//         try {
//             const response = await axios.post('http://localhost:5000/purchase-warranty', { warrantyId: selectedWarranty });
//             setMessage('Warranty purchased successfully');
//         } catch (error) {
//             setMessage('Error purchasing warranty');
//         }
//     };

//     const getAllWarranty = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/getwarrantydata');
//             setData(response.data.data);
//         } catch (error) {
//             console.error('Error fetching warranty data', error);
//         }
//     };

//     return (
//         <div>
//             <h2>Purchase Warranty</h2>

//             <select onChange={(e) => setSelectedWarranty(e.target.value)}>
//                 <option value="">Select a warranty</option>
//                 {warranties.map((warranty) => (
//                     <option key={warranty._id} value={warranty._id}>
//                         {warranty.name} - ${warranty.price}
//                     </option>
//                 ))}
//             </select>
//             <button onClick={handlePurchase}>Purchase</button>
//             <p>{message}</p>

//             <h3>All Warranty Data</h3>
//             <ul>
//                 {data.map((item) => (
//                     <li key={item._id}>
//                         {item.name} - ${item.price}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default PurchaseWarranty;
