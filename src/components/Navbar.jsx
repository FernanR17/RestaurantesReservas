import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <>
            <header className="bg-blue-700 text-white py-4">
                <nav className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold"><Link to={'/'}>Restaurantes Reservas</Link></h1>
                    <div>
                        <Link to="/catalogo" className="px-4 py-2 text-white">Catálogo</Link>
                        <Link to="/login" className="px-4 py-2 bg-green-600 rounded">Iniciar Sesión</Link>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Navbar;