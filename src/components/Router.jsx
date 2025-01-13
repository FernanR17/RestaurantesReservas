import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/Navbar';
import Footer from './Footer';

import Home from "../views/HomePage";
import Catalog from '../views/Catalog';
import RestaurantDetails from '../views/RestaurantDetails';
import LoginPage from '../views/LoginPage';
import RegisterPage from '../views/RegisterPage';

import RegisterProduct from '../views/RegisterProduct';
import Reservations from '../views/Reservations';

const Router = () =>{
    return(
        <div>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/catalogo' element={<Catalog/>} />
                <Route path="/restaurantes/:id" element={<RestaurantDetails />} />
                <Route path='/registrar-producto' element={<RegisterProduct/>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/reservas" element={<Reservations />} />

            </Routes>
            <Footer/>
        </div>
    )
}

export default Router;