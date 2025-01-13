import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

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
                    <Link to={'/'}>Restaurantes Reservas</Link>
                </h1>
                <div className="flex items-center">
                    <Link to="/catalogo" className="px-4 py-2 text-white">
                        Catálogo
                    </Link>
                    {user && user.rol === 'cliente' && (
                        <>
                            <Link to="/reservas" className="px-4 py-2 text-white">
                                Mis Reservas
                            </Link>
                            <Link to="/perfil" className="px-4 py-2 text-white">
                                Perfil
                            </Link>
                        </>
                    )}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 rounded text-white"
                        >
                            Cerrar Sesión
                        </button>

                    ) : (
                        <Link to="/login" className="px-4 py-2 bg-green-600 rounded">
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;


