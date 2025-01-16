import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from "../components/ProtectedRoute";

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import Home from "../views/HomePage";
import Catalog from '../views/Catalog';

import LoginPage from '../views/LoginPage';
import RegisterPage from '../views/RegisterPage';

import RegisterProduct from '../views/RegisterProduct';
import Reservations from '../views/ReservationsPage';

import RegistrarRestaurante from '../views/Restaurante/RegistrarRestaurante';
import RestaurantDetails from '../views/RestaurantDetails';

import ProfilePage from '../views/ProfilePage';

import Restaurante from '../views/Restaurante/DashboardRestaurante';
import PerfilRestaurante from '../views/Restaurante/PerfilRestaurante';
import EstadisticasRestaurante from '../views/Restaurante/EstadisticasRestaurante';

import AdminPanel from '../views/Admin/AdminPanel';
import CategoriasPanel from '../views/Admin/CategoriasPanel';
import RestaurantesPanel from '../views/Admin/RestaurantesPanel';
import UsuariosPanel from '../views/Admin/UsuariosPanel';

const Router = () => {
    return (
        <div>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/catalogo" element={<Catalog />} />
                        <Route path="/restaurantes/:id" element={<RestaurantDetails />} />
                        <Route path="/registrar-producto" element={<RegisterProduct />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/reservas" element={<ProtectedRoute element={Reservations} />} roles={["cliente"]} />
                        <Route path="/perfil" element={<ProtectedRoute element={ProfilePage} roles={["cliente", "restaurante", "admin"]} />} />
                        <Route path="/dashboard/restaurante" element={<ProtectedRoute element={Restaurante} roles={["restaurante"]} />} />
                        <Route path="/nuevo-restaurante" element={<RegistrarRestaurante />} />
                        <Route path="/dashboard/perfil-restaurante" element={<ProtectedRoute element={PerfilRestaurante} roles={["restaurante"]} />} />
                        <Route path="/dashboard/estadisticas-restaurante" element={<ProtectedRoute element={EstadisticasRestaurante} roles={["restaurante"]} />} />
                        <Route path="/admin" element={<ProtectedRoute element={AdminPanel} roles={["admin"]} />} />
                        <Route path="/admin/categorias" element={<ProtectedRoute element={CategoriasPanel} roles={["admin"]} />} />
                        <Route path="/admin/restaurantes" element={<ProtectedRoute element={RestaurantesPanel} roles={["admin"]} />} />
                        <Route path="/admin/usuarios" element={<ProtectedRoute element={UsuariosPanel} roles={["admin"]} />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </div>
    )
}

export default Router;