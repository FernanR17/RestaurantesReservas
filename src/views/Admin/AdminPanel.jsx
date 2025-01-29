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
                text: "You have to log in to view this page.",
            });
            return;
        }

        // Puedes cargar datos adicionales aquí si es necesario
    }, [user]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-indigo-800 mb-6">
                {user?.nombre || "Usuario"}'s Dashboard
            </h1>

            <p className="text-gray-600 mb-6">
                Welcome to your Control Panel.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarjeta de información general */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Categories Info
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Check the performance of your restaurant and analize the data from your clients and reservations.
                    </p>
                    <Link
                        to="/admin/categorias"
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition duration-300 text-center"
                    >
                        View Categories
                    </Link>
                </div>

                {/* Tarjeta de gestión */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Restaurant Management
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Manage your data and update your restaurant's information to keep all up to date.
                    </p>
                    <Link
                        to="/admin/restaurantes"
                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-800 transition duration-300 text-center"
                    >
                        Manage Restaurants
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Users
                    </h2>
                    <p className="text-gray-600 mb-4">
                    Check the performance of your restaurant and analize the data from your clients and reservations.
                    </p>
                    <Link
                        to="/admin/usuarios"
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition duration-300 text-center"
                    >
                        View Users
                    </Link>
                </div>
            </div>

        </div>
    );
};

export default AdminPanel;
