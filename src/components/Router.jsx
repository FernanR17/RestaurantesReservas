import { Routes, Route } from 'react-router-dom'
import Home from "../views/HomePage";
import Catalog from '../views/Catalog';
import RestaurantDetails from '../views/RestaurantDetails';
import Navbar from '../components/Navbar';
import Footer from './Footer';
import RegisterProduct from '../views/RegisterProduct';

const Router = () =>{
    return(
        <div>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/catalogo' element={<Catalog/>} />
                <Route path="/restaurantes/:id" element={<RestaurantDetails />} />
                <Route path='/registrar-producto' element={<RegisterProduct/>} />
            </Routes>
            <Footer/>
        </div>
    )
}

export default Router;