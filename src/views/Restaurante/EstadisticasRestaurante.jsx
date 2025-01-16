import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const EstadisticasRestaurante = () => {
    const [reservas, setReservas] = useState([]);
    const [capacidadMaxima, setCapacidadMaxima] = useState(0);
    const [totalReservas, setTotalReservas] = useState(0);
    const apiUrl = "http://localhost/restaurante/api.php";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.id_usuario) throw new Error("Usuario no válido");

                // Obtener información del restaurante
                const resRestaurante = await axios.get(`${apiUrl}/restaurantes?usuario=${user.id_usuario}`);
                const idRestaurante = resRestaurante.data.id_restaurante;

                if (!idRestaurante) {
                    throw new Error("No se pudo obtener el ID del restaurante.");
                }

                setCapacidadMaxima(resRestaurante.data.capacidad_maxima);

                // Obtener reservas con cliente
                const resReservas = await axios.get(`${apiUrl}/reservas_con_clientes?id_restaurante=${idRestaurante}`);
                setReservas(resReservas.data);
                setTotalReservas(resReservas.data.length);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron cargar los datos de las estadísticas.",
                    icon: "error",
                });
            }
        };

        fetchData();
    }, []);

    const handleCancelReserva = async (idReserva) => {
        try {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esto cancelará la reserva seleccionada.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cancelar",
                cancelButtonText: "No, volver",
            });

            if (result.isConfirmed) {
                await axios.put(`${apiUrl}/reservas/${idReserva}`, { estado: "cancelada" });
                setReservas((prev) =>
                    prev.map((reserva) =>
                        reserva.id_reserva === idReserva ? { ...reserva, estado: "cancelada" } : reserva
                    )
                );

                Swal.fire({
                    title: "Cancelada",
                    text: "La reserva ha sido cancelada.",
                    icon: "success",
                });
            }
        } catch (error) {
            console.error("Error al cancelar la reserva:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo cancelar la reserva.",
                icon: "error",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-indigo-800 mb-6">Estadísticas del Restaurante</h1>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Reservas Totales: {totalReservas}</h2>
                <h2 className="text-2xl font-semibold">Capacidad Máxima: {capacidadMaxima}</h2>
            </div>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Cliente</th>
                        <th className="border border-gray-300 px-4 py-2">Fecha</th>
                        <th className="border border-gray-300 px-4 py-2">Hora</th>
                        <th className="border border-gray-300 px-4 py-2">Número de Personas</th>
                        <th className="border border-gray-300 px-4 py-2">Comentarios</th>
                        <th className="border border-gray-300 px-4 py-2">Estado</th>
                        <th className="border border-gray-300 px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => (
                        <tr key={reserva.id_reserva} className="text-center">
                            <td className="border border-gray-300 px-4 py-2">{reserva.cliente}</td>
                            <td className="border border-gray-300 px-4 py-2">{reserva.fecha_reserva}</td>
                            <td className="border border-gray-300 px-4 py-2">{reserva.hora_reserva}</td>
                            <td className="border border-gray-300 px-4 py-2">{reserva.numero_personas}</td>
                            <td className="border border-gray-300 px-4 py-2">{reserva.comentarios}</td>
                            <td className="border border-gray-300 px-4 py-2">{reserva.estado}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 mr-2"
                                    onClick={() => handleCancelReserva(reserva.id_reserva)}
                                >
                                    Cancelar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EstadisticasRestaurante;
