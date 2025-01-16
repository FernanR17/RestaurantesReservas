import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUtensils,
    faChartLine,
    faBell,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import restaurantefoto from "../../components/categorias.png";

const DashboardRestaurante = () => {
    const [restaurantData, setRestaurantData] = useState({});
    const [loading, setLoading] = useState(true);
    const [reservasPendientes, setReservasPendientes] = useState([]);

    const apiUrl = "http://localhost/restaurante/api.php";

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);

    const handleOpenModal = (reserva) => {
        setSelectedReserva(reserva);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedReserva(null);
        setModalOpen(false);
    };

    // Fetch restaurant information
    const fetchRestaurantInfo = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id_usuario) throw new Error("Usuario no válido");

            const res = await axios.get(
                `${apiUrl}/restaurantes?usuario=${user.id_usuario}`
            );
            // console.log("Datos del restaurante recibidos:", res.data); // LOG
            
            setRestaurantData(res.data);
        } catch (error) {
            console.error("Error al obtener la información del restaurante:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo cargar la información del restaurante.",
                icon: "error",
            });
        }
    };

    // Fetch pending reservations
    const fetchReservasPendientes = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            // console.log("Usuario cargado:", user);
            if (!user || !user.id_usuario) throw new Error("Usuario no válido");

            const idRestaurante = restaurantData?.id_restaurante;
            if (!idRestaurante) {
                console.error("ID de restaurante no disponible");
                return; // Evita lanzar un error y termina la ejecución
            }

            // console.log("Llamando al endpoint con ID restaurante:", idRestaurante);
            const res = await axios.get(`${apiUrl}/reservas_por_restaurante`, {
                params: {
                    id_restaurante: idRestaurante,
                    estado: "pendiente",
                },
            });

            // console.log("Reservas pendientes recibidas:", res.data);
            setReservasPendientes(res.data || []);
        } catch (error) {
            console.error("Error al obtener las reservas pendientes:", error);
        }
    };

    const handleConfirmarReserva = async (id) => {
        try {
            await axios.put(`${apiUrl}/reservas/${id}`, { estado: "confirmada" });
            Swal.fire({
                icon: "success",
                title: "Reserva confirmada",
                timer: 2000,
                showConfirmButton: false,
            });
            fetchReservasPendientes();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo confirmar la reserva.",
            });
        }
    };

    const handleEliminarReserva = async (id) => {
        Swal.fire({
            title: "¿Eliminar reserva?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${apiUrl}/reservas/${id}`);
                    Swal.fire("Eliminada", "La reserva ha sido eliminada.", "success");
                    fetchReservasPendientes();
                } catch (error) {
                    Swal.fire("Error", "No se pudo eliminar la reserva.", "error");
                }
            }
        });
    };

    useEffect(() => {
        const cargarDatos = async () => {
            await fetchRestaurantInfo();
        };
        cargarDatos();
    }, []);

    // Efecto para cargar reservas pendientes cuando el restaurante esté disponible
    useEffect(() => {
        if (restaurantData?.id_restaurante) {
            fetchReservasPendientes();
        }
        setLoading(false);
    }, [restaurantData]);

    if (loading) {
        return (
            <p className="text-center mt-20">
                Cargando información del restaurante...
            </p>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-indigo-800 mb-6">
                Dashboard de {restaurantData?.nombre || "Restaurante"}
                <img
                    src={restaurantData?.imagen || restaurantefoto}
                    alt="Restaurante"
                    className="inline-block ml-4 h-10 w-10 rounded-full"
                />
            </h1>

            <p className="text-gray-600 mb-6">
                Bienvenido al panel de control de tu restaurante.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarjeta de información general */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Información del Restaurante
                    </h2>
                    <p className="text-gray-600 mb-2">
                        Nombre: {restaurantData?.nombre || "N/A"}
                    </p>
                    <p className="text-gray-600 mb-2">
                        Ubicación: {restaurantData?.ubicacion || "N/A"}
                    </p>
                    <p className="text-gray-600 mb-2">
                        Reservas Activas:{" "}
                        <span className="font-semibold">
                            {restaurantData?.reservas_activas ?? 0}
                        </span>
                    </p>

                </div>

                {/* Tarjeta de gestión */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Gestión del Restaurante
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Administra tus datos y actualiza la información de tu restaurante
                        para mantener todo al día.
                    </p>
                    <Link
                        to="/dashboard/perfil-restaurante"
                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-800 transition duration-300 text-center"
                    >
                        Gestionar Restaurante
                    </Link>
                </div>

                {/* Tarjeta de estadísticas */}
                <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Estadísticas
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Revisa el desempeño de tu restaurante y analiza los datos de tus
                        clientes y reservas.
                    </p>
                    <Link
                        to="/dashboard/estadisticas-restaurante"
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800 transition duration-300 text-center"
                    >
                        Ver Estadísticas
                    </Link>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Notificaciones
                </h2>
                {/* {console.log("Datos en reservasPendientes:", reservasPendientes)}{" "} */}
                {/* LOG */}
                {reservasPendientes.length === 0 ? (
                    <p className="text-gray-600">No tienes notificaciones nuevas.</p>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 bg-gray-100">Cliente</th>
                                <th className="py-2 px-4 bg-gray-100">Fecha</th>
                                <th className="py-2 px-4 bg-gray-100">Hora</th>
                                <th className="py-2 px-4 bg-gray-100">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservasPendientes.map((reserva) => (
                                <tr key={reserva.id_reserva}>
                                    <td className="py-2 px-4 border-b">{reserva.cliente}</td> {/* Asegúrate de usar `reserva.cliente` */}
                                    <td className="py-2 px-4 border-b">{reserva.fecha_reserva}</td>
                                    <td className="py-2 px-4 border-b">{reserva.hora_reserva}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => handleOpenModal(reserva)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded-lg mr-2"
                                        >
                                            Detalles
                                        </button>
                                        <button
                                            onClick={() => handleConfirmarReserva(reserva.id_reserva)}
                                            className="bg-green-500 text-white px-2 py-1 rounded-lg mr-2"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={() => handleEliminarReserva(reserva.id_reserva)}
                                            className="bg-red-500 text-white px-2 py-1 rounded-lg"
                                        >
                                            Cancelar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {modalOpen && selectedReserva && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-2xl font-bold mb-4">Detalles de la Reserva</h2>
                        <p>
                            <strong>Cliente:</strong> {selectedReserva.nombre_cliente}
                        </p>
                        <p>
                            <strong>Fecha:</strong> {selectedReserva.fecha_reserva}
                        </p>
                        <p>
                            <strong>Hora:</strong> {selectedReserva.hora_reserva}
                        </p>
                        <p>
                            <strong>Número de Personas:</strong>{" "}
                            {selectedReserva.numero_personas}
                        </p>
                        <p>
                            <strong>Comentarios:</strong>{" "}
                            {selectedReserva.comentarios || "Sin comentarios"}
                        </p>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={() => {
                                    handleConfirmarReserva(selectedReserva.id_reserva);
                                    handleCloseModal();
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={() => {
                                    handleEliminarReserva(selectedReserva.id_reserva);
                                    handleCloseModal();
                                }}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardRestaurante;
