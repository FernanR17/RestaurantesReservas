import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Footer = () => {
  const [opiniones, setOpiniones] = useState([]);
  const apiUrl = "http://localhost/restaurante/api.php";

  useEffect(() => {
    const fetchOpiniones = async () => {
      try {
        const res = await axios.get(`${apiUrl}/opiniones`);
        setOpiniones(res.data);
      } catch (error) {
        console.error("Error al cargar opiniones:", error);
      }
    };

    fetchOpiniones();
  }, []);

  return (
    <footer className="bg-gray-800 text-white">
      {/* Navbar */}
      <div className="container mx-auto px-4 py-6 flex justify-between items-center border-b border-gray-600">
        <Link to="/" className="text-xl font-bold hover:text-indigo-400">
          GoTable
        </Link>
        <nav className="flex space-x-4">
          <Link to="/" className="hover:text-indigo-400">
            Inicio
          </Link>
          <Link to="/catalogo" className="hover:text-indigo-400">
            Catálogo
          </Link>
          <Link to="/reservas" className="hover:text-indigo-400">
            Mis Reservas
          </Link>
        </nav>
      </div>

      {/* Redes Sociales */}
      <div className="container mx-auto px-4 py-6 flex justify-center space-x-6">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl hover:text-indigo-400"
        >
          <i className="fab fa-facebook"></i>
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl hover:text-indigo-400"
        >
          <i className="fab fa-twitter"></i>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl hover:text-indigo-400"
        >
          <i className="fab fa-instagram"></i>
        </a>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-900 py-4 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} GoTable. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
