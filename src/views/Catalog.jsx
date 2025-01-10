import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import categorias from '../components/categorias.png';

const Catalog = () => {
  const [dataRestaurant, setDataRestaurant] = useState([]);

  const apiUrl = 'http://localhost/restaurante/api.php';

  const config = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Incluir credenciales
};

const getAllRestaurants = async () => {
    try {
        const res = await axios.get(`${apiUrl}/restaurantes`, config);
        console.log('Datos recibidos de la API:', res.data); // Depuración
        setDataRestaurant(res.data);
    } catch (error) {
        console.error('Error al obtener los restaurantes:', error);
    }
};


  useEffect(() => {
    getAllRestaurants();
  }, []);

  console.log('Estado actual de restaurantes:', dataRestaurant); // Depuración

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="p-4">
          <Link to={'/nuevo-restaurante'}>
            <button className="flex ml-auto select-none rounded-lg bg-indigo-800 uppercase py-4 px-8 text-center font-sans text-sm font-bold text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20">
              Registrar Restaurante
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap -m-4">
          {dataRestaurant.length > 0 ? (
            dataRestaurant.map((item, key) => (
              <div className="p-4 md:w-1/3" key={key}>
                <div className="h-full border-2 border-gray-200 border-opacity-90 rounded-lg overflow-hidden">
                  <h2>{item.nombre}</h2>
                  <p>{item.descripcion}</p>
                  <p>Ubicación: {item.ubicacion}</p>
                  <p>Categoría: {item.categoria}</p>
                  <p>Horario: {item.horario_apertura} - {item.horario_cierre}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">No hay restaurantes registrados</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Catalog;
