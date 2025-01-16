import React, { useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Swal from "sweetalert2";

import { Link } from "react-router-dom";

const AdminPanel = () => {

    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Debes iniciar sesión para acceder a esta página.",
            });
            return;
        }

        // Puedes cargar datos adicionales aquí si es necesario
    }, [user]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-indigo-800 mb-6">
                Dashboard de {user?.nombre || "Usuario"}
            </h1>

            <p className="text-gray-600 mb-6">
                Bienvenido a su panel de control.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarjeta de información general */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Información de las categorias
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Revisa el desempeño de tu restaurante y analiza los datos de tus
                        clientes y reservas.
                    </p>
                    <Link
                        to="/admin/categorias"
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition duration-300 text-center"
                    >
                        Ver Categorias
                    </Link>
                </div>

                {/* Tarjeta de gestión */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Gestión de los Restaurante
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Administra tus datos y actualiza la información de tu restaurante
                        para mantener todo al día.
                    </p>
                    <Link
                        to="/admin/restaurantes"
                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-800 transition duration-300 text-center"
                    >
                        Gestionar Restaurantes
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Usuarios
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Revisa el desempeño de tu restaurante y analiza los datos de tus
                        clientes y reservas.
                    </p>
                    <Link
                        to="/admin/usuarios"
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition duration-300 text-center"
                    >
                        Ver Usuarios
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default AdminPanel;
