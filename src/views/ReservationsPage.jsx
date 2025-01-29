import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "react-modal";

import restaurante from "../components/categorias.png";

const ReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const apiUrl = "http://localhost/restaurante/api.php";

    const fetchReservations = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const res = await axios.get(`${apiUrl}/reservas`, {
                params: { id_usuario: user.id_usuario },
            });
            setReservations(res.data || []);
        } catch (error) {
            console.error("Error getting reservations:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error while loading your reservations.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (reservation) => {
        setSelectedReservation(reservation);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedReservation(null);
        setIsModalOpen(false);
    };

    const cancelReservation = async (id) => {
        Swal.fire({
            title: "Cancel Reservation?",
            text: "This action can't be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`${apiUrl}/reservas/${id}`);
                    Swal.fire("Cancelada", "Tu reserva ha sido cancelada.", "success");
                    fetchReservations();
                } catch (error) {
                    console.error("Error al cancelar la reserva:", error);
                    Swal.fire("Error", "No se pudo cancelar la reserva.", "error");
                }
            }
        });
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-indigo-800 mb-6">My Reservations</h1>
            <Link to="/catalogo" className="text-blue-600 hover:underline mb-4 block">
                View Catalog
            </Link>

            {loading ? (
                <p className="text-center">Loading reservations...</p>
            ) : reservations.length === 0 ? (
                <p className="text-center text-gray-600">You don't have any reservations yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reservations.map((reserva) => (
                        <div
                            key={reserva.id_reserva}
                            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg"
                        >
                            <img
                                src={reserva.imagen_restaurante || restaurante}
                                alt={reserva.nombre_restaurante}
                                className="w-full h-32 object-cover rounded-md mb-4"
                            />
                            <h2 className="text-lg font-bold text-gray-800 mb-2">
                                {reserva.nombre_restaurante}
                            </h2>
                            <p className="text-gray-600">
                                Date: <span className="font-medium">{reserva.fecha_reserva}</span>
                            </p>
                            <p className="text-gray-600">
                                Time: <span className="font-medium">{reserva.hora_reserva}</span>
                            </p>
                            <p className="text-gray-600">
                                People: <span className="font-medium">{reserva.numero_personas}</span>
                            </p>
                            <p
                                className={`text-sm font-bold ${reserva.estado === "pendiente"
                                    ? "text-yellow-500"
                                    : reserva.estado === "confirmada"
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                            >
                                Status: {reserva.estado}
                            </p>
                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={() => cancelReservation(reserva.id_reserva)}
                                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleViewDetails(reserva)}
                                    className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Reservation details"
                className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-10"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                ariaHideApp={false}
            >
                <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">Reservation details</h2>
                {selectedReservation ? (
                    <div className="space-y-6">
                        <p className="text-gray-700 text-lg">
                            <span className="font-semibold">Restaurant:</span> {selectedReservation.nombre_restaurante}
                        </p>
                        <p className="text-gray-700 text-lg">
                            <span className="font-semibold">Date:</span> {selectedReservation.fecha_reserva}
                        </p>
                        <p className="text-gray-700 text-lg">
                            <span className="font-semibold">Time:</span> {selectedReservation.hora_reserva}
                        </p>
                        <p className="text-gray-700 text-lg">
                            <span className="font-semibold">People:</span> {selectedReservation.numero_personas}
                        </p>
                        <p className="text-gray-700 text-lg">
                            <span className="font-semibold">Status:</span> {selectedReservation.estado}
                        </p>
                        <p className="text-gray-700 text-lg">
                            <span className="font-semibold">Comments:</span> {selectedReservation.comentarios || "N/A"}
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700 text-lg text-center">Loading Details...</p>
                )}
            </Modal>
        </div>
    );
};

export default ReservationsPage;
