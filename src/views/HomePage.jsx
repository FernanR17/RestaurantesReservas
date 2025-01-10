import fondo from "../components/fondo.jpeg";
import imagen1 from "../components/imagen1.jpg";
import imagen2 from "../components/imagen2.jpg";
import { Link } from "react-router-dom";


const HomePage = ({ categorias = [], opiniones = [] }) => (
  <div className="bg-gray-100 min-h-screen flex flex-col">
    

    {/* Carrusel */}
    <div className="container mx-auto px-4 py-6">
      <div className="relative h-64 bg-gray-300 rounded-lg shadow-md flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700">Carrusel de imágenes</h2>
      </div>
    </div>

    {/* Imágenes de Restaurantes */}
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categorias.length > 0 ? (
          categorias.map((categoria) => (
            <div
              key={categoria.id_categoria}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg"
            >
              <img
                src={categoria.imagen_url || imagen1}
                alt={categoria.nombre_categoria}
                className="w-full h-32 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-blue-700">{categoria.nombre_categoria}</h3>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay categorías disponibles.</p>
        )}
      </div>
    </section>

    {/* Botón al Catálogo */}
    <div className="text-center py-4">
      <Link to="/catalogo">
        <button className="bg-blue-700 text-white py-2 px-4 rounded-lg font-bold text-lg">
          Ver Catálogo de Restaurantes
        </button>
      </Link>
    </div>

    {/* Opiniones */}
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Opiniones de Clientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {opiniones.length > 0 ? (
          opiniones.map((opinion) => (
            <div
              key={opinion.id_opinion}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-blue-700">Cliente {opinion.id_usuario}</h3>
              <p className="text-gray-600">{opinion.comentario}</p>
              <p className="text-sm text-gray-500">Calificación: {opinion.calificacion} estrellas</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay opiniones disponibles.</p>
        )}
      </div>
    </section>

    
  </div>
);

export default HomePage;
