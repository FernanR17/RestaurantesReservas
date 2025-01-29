import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
    const { user, logout } = useContext(UserContext);

    const handleLogout = () => {
        logout();
        window.location.href = "/login"; // Redirigir al login tras cerrar sesión
    };

    return (
        <header className="bg-blue-700 text-white py-4">
            <nav className="container mx-auto px-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    <Link to="/">SmartReserva - Restaurants</Link>
                </h1>
                <div className="flex items-center">
                <Link to="/" className="px-4 py-2 text-white">
                        Home
                    </Link>
                    <Link to="/catalogo" className="px-4 py-2 text-white">
                        Catalog
                    </Link>
                    {user && user.rol === "cliente" && (
                        <>
                            <Link to="/reservas" className="px-4 py-2 text-white">
                                My Reservations
                            </Link>
                            <Link to="/perfil" className="px-4 py-2 text-white">
                                Profile
                            </Link>
                        </>
                    )}
                    {user && user.rol === "restaurante" && (
                        <>
                            <Link to="/dashboard/restaurante" className="px-4 py-2 text-white">
                                Dashboard
                            </Link>
                            <Link to="/perfil" className="px-4 py-2 text-white">
                                Profile
                            </Link>
                        </>
                    )}
                    {user && user.rol === "admin" && (
                        <>
                            <Link to="/admin" className="px-4 py-2 text-white">
                                Admin
                            </Link>
                            <Link to="/perfil" className="px-4 py-2 text-white">
                                User
                            </Link>
                        </>
                    )}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 rounded text-white"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="px-4 py-2 bg-green-600 rounded">
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
