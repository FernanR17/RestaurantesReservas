import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import categorias from "../components/categorias.png";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Catalog = () => {
  const { user } = useContext(UserContext);
  const [dataRestaurant, setDataRestaurant] = useState([]);
  const apiUrl = "http://localhost/restaurante/api.php";

  const config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true, // Incluir credenciales
  };

  const getAllRestaurants = async () => {
    try {
      const res = await axios.get(`${apiUrl}/restaurantes`, config);
      setDataRestaurant(res.data);
    } catch (error) {
      console.error("Error al obtener los restaurantes:", error);
    }
  };

  useEffect(() => {
    getAllRestaurants();
  }, []);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        {/* Botón de registro */}
        {user && user.rol === "admin" && (
             <div className="mb-8">
             <Link to={"/nuevo-restaurante"}>
               <button className="flex ml-auto select-none rounded-lg bg-indigo-800 uppercase py-4 px-8 text-center font-sans text-sm font-bold text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20">
                 Registrar Restaurante
               </button>
             </Link>
           </div>
        )}
       

        {/* Tarjetas de restaurantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataRestaurant.length > 0 ? (
            dataRestaurant.map((item, key) => (
              <div
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all"
                key={key}
              >
                <img
                  src={item.imagen_url || categorias} // Imagen dinámica o por defecto
                  alt={item.nombre}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-indigo-800 mb-2">
                    {item.nombre}
                  </h2>
                  <p className="text-gray-700 mb-2">{item.descripcion}</p>
                  <p className="text-sm text-gray-500">
                    Ubicación: {item.ubicacion}
                  </p>
                  <p className="text-sm text-gray-500">
                    Categoría: {item.categoria}
                  </p>
                  <p className="text-sm text-gray-500">
                    Horario: {item.horario_apertura} - {item.horario_cierre}
                  </p>
                  <div className="mt-4">
                  <Link to={`/restaurantes/${item.id_restaurante}`}>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700">
                        Ver Detalles
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center col-span-full">
              No hay restaurantes registrados
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Catalog;
