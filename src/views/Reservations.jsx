import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Reservations = () => {
  const { user } = useContext(UserContext);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(
          `http://localhost/restaurante/api.php/reservas/${user.id_usuario}`
        );
        setReservations(res.data);
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Reservas</h1>
      {reservations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((reservation) => (
            <div
              key={reservation.id_reserva}
              className="bg-white shadow-md rounded-lg p-6"
            >
              <h2 className="text-lg font-semibold text-indigo-800">
                {reservation.nombre_restaurante}
              </h2>
              <p className="text-gray-700">
                Fecha: {reservation.fecha_reserva}
              </p>
              <p className="text-gray-700">
                Hora: {reservation.hora_reserva}
              </p>
              <p className="text-gray-700">
                Personas: {reservation.numero_personas}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No tienes reservas actualmente.</p>
      )}
    </div>
  );
};

export default Reservations;
