import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import categorias from "../components/categorias.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock, faTag, faStar } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { UserContext } from "../context/UserContext";

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [restaurant, setRestaurant] = useState(null);
  const [opiniones, setOpiniones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservationData, setReservationData] = useState({
    fecha_reserva: "",
    hora_reserva: "",
    numero_personas: "",
    comentarios: "",
  });

  const apiUrl = "http://localhost/restaurante/api.php";

  Modal.setAppElement("#root");

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setReservationData({
      ...reservationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        title: "Login",
        text: "You must login to make a reservation.",
        icon: "info",
        confirmButtonText: "Accept",
      });
      return;
    }

    try {
      await axios.post(`${apiUrl}/reservas`, {
        id_usuario: user.id_usuario,
        id_restaurante: id,
        fecha_reserva: reservationData.fecha_reserva,
        hora_reserva: reservationData.hora_reserva,
        numero_personas: reservationData.numero_personas,
        comentarios: reservationData.comentarios,
        estado: "pendiente",
      });

      Swal.fire({
        title: "Reservation created",
        text: "Your reservation was registered successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        didClose: () => {
          handleCloseModal();
          navigate("/reservas");
        },
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "Unable to register the reservation.",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const res = await axios.get(`${apiUrl}/restaurantes/${id}`);
        setRestaurant(res.data);
      } catch (error) {
        console.error("Error getting restaurant's details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOpiniones = async () => {
      try {
        const res = await axios.get(`${apiUrl}/opiniones/${id}`);
        const sortedOpiniones = res.data.sort((a, b) => b.calificacion - a.calificacion).slice(0, 3);
        setOpiniones(sortedOpiniones || []);
      } catch (error) {
        console.error("Error while loading opinions:", error);
      }
    };

    fetchRestaurantDetails();
    fetchOpiniones();
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading restaurant details...</p>;
  if (!restaurant) return <p className="text-center mt-20">Unable to find the restaurant.</p>;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <img
            src={restaurant.imagen_url || categorias}
            alt={restaurant.nombre}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          <div className="md:w-1/4 bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* Columna izquierda */}
            <div>
              <h1 className="text-3xl font-bold text-indigo-800 mb-4">{restaurant.nombre}</h1>
              <p className="text-gray-700 mb-4">{restaurant.descripcion}</p>
              <div className="mb-4">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 mr-2" />
                <span className="text-gray-600">Location: {restaurant.ubicacion}</span>
              </div>
              <div className="mb-4">
                <FontAwesomeIcon icon={faClock} className="text-blue-600 mr-2" />
                <span className="text-gray-600">
                  Horario: {restaurant.horario_apertura} - {restaurant.horario_cierre}
                </span>
              </div>
              <div className="mb-4">
                <FontAwesomeIcon icon={faTag} className="text-blue-600 mr-2" />
                <span className="text-gray-600">Category: {restaurant.categoria}</span>
              </div>

              <div className="mb-4">
                <span className="font-semibold text-gray-700">Maximum capacity:</span>{" "}
                <span className="text-gray-600">{restaurant.capacidad_maxima}</span>
              </div>
              <div className="mb-4">
                <span className="font-semibold text-gray-700">Current availability:</span>{" "}
                <span className="text-gray-600">
                  {/* Si existe lógica para calcular la disponibilidad */}
                  {restaurant.disponibilidad_actual ?? "Data not available"}
                </span>
              </div>
              <button
                onClick={handleOpenModal}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-6 w-full"
              >
                Reserve Now
              </button>
            </div>

          </div>

          <div className="md:w-1/3 bg-gray-100 rounded-lg shadow-md p-6">
            {/* Mapa dinámico */}

            <h3 className="text-lg font-bold mb-4">Map Location</h3>
            <iframe
              width="100%"
              height="300"
              frameBorder="0"
              style={{ maxHeight: "400px" }}
              src={
                restaurant.mapa_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d41227.599172908696!2d-89.23589423800759!3d13.691519041144586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f633067b411775d%3A0x1f75978893fb5c96!2sSan%20Salvador!5e1!3m2!1ses-419!2ssv!4v1736890859881!5m2!1ses-419!2ssv" // URL genérica de San Salvador
              }
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant's map"
              className="rounded-lg"
            ></iframe>

          </div>

          <div className="md:w-1/3 bg-gray-100 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">Featured Opinions</h3>
            {opiniones.length > 0 ? (
              opiniones.map((opinion, index) => (
                <div key={index} className="mb-4 border-b border-gray-300 pb-4">
                  <p className="italic">"{opinion.comentario}"</p>
                  <p className="text-sm text-gray-600 font-bold">{opinion.usuario}</p>
                  <p className="flex items-center text-sm text-gray-600">
                    {Array.from({ length: opinion.calificacion }).map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500 mr-1" />
                    ))}
                    {Array.from({ length: 5 - opinion.calificacion }).map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} className="text-gray-300 mr-1" />
                    ))}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No opinions available yet.</p>
            )}
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          contentLabel="Nueva Reserva"
          className="bg-white p-10 rounded-xl shadow-2xl w-11/12 max-w-3xl mx-auto relative z-50"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40"
          ariaHideApp={false}
        >
          <h2 className="text-4xl font-bold text-indigo-800 mb-8 text-center">Nueva Reserva</h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">Date</label>
              <input
                type="date"
                name="fecha_reserva"
                value={reservationData.fecha_reserva}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-3 text-lg"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">Time</label>
              <input
                type="time"
                name="hora_reserva"
                value={reservationData.hora_reserva}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-3 text-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">Number of people to reserve</label>
              <input
                type="number"
                name="numero_personas"
                value={reservationData.numero_personas}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-3 text-lg"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-lg">Comments</label>
              <textarea
                name="comentarios"
                value={reservationData.comentarios}
                onChange={handleInputChange}
                className="w-full border rounded-lg px-4 py-3 text-lg"
                rows="4"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-800 transition-all duration-300 text-lg"
              >
                Reserve
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-600 text-white py-3 px-8 rounded-lg hover:bg-gray-700 transition-all duration-300 text-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>


      </div>
    </>
  );
};

export default RestaurantDetails;
