import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import ForgotPassword from './Pages/forgot-password';
import Users from './Pages/users';
import Technicians from './Pages/technicians';
import UsersProfile from './Pages/frontend/profile';
import TechnicianRegister from './Pages/TechnicianRegister';
import AddProduct from './Pages/product-management/add-product';
import AllProducts from './Pages/product-management/all-product';
import Modal from './Pages/product-management/modal';
import Warranty from './Pages/warranty/user-warranty';
import AddWarranty from './Pages/warranty/add-warranty';
import Notification from './Pages/notification/notification';
import Order from './Pages/recent-orders';

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={isLoggedIn === "true" ? <Dashboard /> : <Login />} exact />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route path="/forgot-password" Component={ForgotPassword} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/users" Component={Users} />
        <Route path="/technicians" Component={Technicians} />
        <Route path="/profile" Component={UsersProfile} />
        <Route path="/technician-register" Component={TechnicianRegister} />
        <Route path="/add-product" Component={AddProduct} />
        <Route path="/all-products" Component={AllProducts} />
        <Route path="/add-model" Component={Modal} />
        <Route path="/user-warranty" Component={Warranty} />
        <Route path="/add-warranty" Component={AddWarranty} />
        <Route path="/notification" Component={Notification} />
        <Route path="/order" Component={Order} />
      </Routes>
    </div>
  );
}

export default App;
