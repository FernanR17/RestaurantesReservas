import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import categorias from "../components/categorias.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faClock, faTag, faStar } from "@fortawesome/free-solid-svg-icons";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [opiniones, setOpiniones] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = "http://localhost/restaurante/api.php";

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const res = await axios.get(`${apiUrl}/restaurantes/${id}`);
        setRestaurant(res.data);
      } catch (error) {
        console.error("Error al obtener los detalles del restaurante:", error);
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
        console.error("Error al obtener opiniones:", error);
      }
    };

    fetchRestaurantDetails();
    fetchOpiniones();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-20">Cargando detalles del restaurante...</p>;
  }

  if (!restaurant) {
    return <p className="text-center mt-20">No se encontró el restaurante.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Imagen del Restaurante */}
      <div className="mb-8">
        <img
          src={restaurant.imagen_url || categorias}
          alt={restaurant.nombre}
          className="w-full h-64 object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Layout Principal */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Detalles del Restaurante */}
        <div className="md:w-2/3 bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-indigo-800 mb-4">{restaurant.nombre}</h1>
          <p className="text-gray-700 mb-4">{restaurant.descripcion}</p>

          <div className="mb-4">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-600 mr-2" />
            <span className="text-gray-600">Ubicación: {restaurant.ubicacion}</span>
          </div>

          <div className="mb-4">
            <FontAwesomeIcon icon={faClock} className="text-blue-600 mr-2" />
            <span className="text-gray-600">
              Horario: {restaurant.horario_apertura} - {restaurant.horario_cierre}
            </span>
          </div>

          <div className="mb-4">
            <FontAwesomeIcon icon={faTag} className="text-blue-600 mr-2" />
            <span className="text-gray-600">Categoría: {restaurant.categoria}</span>
          </div>

          {/* Botón para regresar */}
          <div className="mt-6">
            <Link to="/catalogo">
              <button className="bg-indigo-800 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-900">
                Regresar al Catálogo
              </button>
            </Link>
          </div>
        </div>

        {/* Opiniones Destacadas */}
        <div className="md:w-1/3 bg-gray-100 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Opiniones Destacadas</h3>
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
            <p className="text-sm text-gray-500">No hay opiniones disponibles.</p>
          )}
        </div>
      </div>

      {/* Mapa */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Ubicación en el mapa</h3>
        <iframe
          width="100%"
          height="300"
          frameBorder="0"
          src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
            restaurant.ubicacion
          )}&key=TU_API_KEY`}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default RestaurantDetails;
