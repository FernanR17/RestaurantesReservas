import fondo from "../components/fondo.jpeg";
import imagen1 from "../components/imagen1.jpg";
import imagen2 from "../components/imagen2.jpg";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
  const [categorias, setCategorias] = useState([]);
  const [opiniones, setOpiniones] = useState([]);

  const CustomNextArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        right: "10px", // Ajuste dinámico
        transform: "translateY(-50%)",
        width: "40px",
        height: "40px",
        backgroundColor: "#4b5563",
        borderRadius: "50%",
        cursor: "pointer",
        zIndex: 2,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );

  const CustomPrevArrow = ({ onClick }) => (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        left: "10px", // Ajuste dinámico
        transform: "translateY(-50%)",
        width: "40px",
        height: "40px",
        backgroundColor: "#4b5563",
        borderRadius: "50%",
        cursor: "pointer",
        zIndex: 2,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  );

  const settingsOpiniones = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Pantallas grandes
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 768, // Resoluciones medianas, tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Resoluciones pequeñas (iPhone SE, Galaxy A51)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 430, // Resoluciones específicas como iPhone 14 Pro Max
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  

  const settings = {
    dots: true, // Puntos de navegación
    infinite: true, // Ciclo infinito
    speed: 500, // Velocidad de transición
    slidesToShow: 1, // Cuántas imágenes mostrar al mismo tiempo
    slidesToScroll: 1, // Cuántas imágenes pasar al mismo tiempo
    autoplay: true, // Hacer que sea automático
    autoplaySpeed: 3000, // Tiempo entre cada transición (en milisegundos)
    arrows: true, // Ocultar flechas
  };

  const imagenes = [imagen1, imagen2, fondo];

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await fetch("/api.php/homepage");
        const data = await response.json();
        setCategorias(data.categorias || []);
        setOpiniones(data.opiniones || []);
      } catch (error) {
        console.error("Error al cargar los datos del inicio:", error);
      }
    };

    fetchHomepageData();
  }, []);

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {/* Carrusel */}
        <div className="container mx-auto px-4 py-8">
          <Slider {...settings}>
            {imagenes.map((imagen, index) => (
              <div key={index}>
                <img
                  src={imagen}
                  alt="Imagen destacada del restaurante"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Imágenes de Restaurantes */}
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Categorías Destacadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categorias.slice(0, 3).map((categoria) => (
              <div
                key={categoria.id_categoria}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg"
              >
                <img
                  src={categoria.imagen_url || imagen1}
                  alt={categoria.nombre_categoria}
                  className="w-full h-32 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold text-blue-700">
                  {categoria.nombre_categoria}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Botón al Catálogo */}
        <div className="text-center py-4">
          <Link to="/catalogo">
            <button className="bg-blue-700 text-white py-2 px-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition duration-300">
              Ver Catálogo de Restaurantes
            </button>
          </Link>
        </div>

        {/* Opiniones */}
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Opiniones de Clientes</h2>
          <Slider {...settingsOpiniones} className="custom-slider">
            {opiniones.map((opinion) => (
              <div
                key={opinion.id_opinion}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold text-blue-700">
                  {opinion.usuario}
                </h3>
                <p className="text-gray-600 italic">"{opinion.comentario}"</p>
                <p className="text-sm text-gray-500">
                  Calificación: {opinion.calificacion} estrellas
                </p>
                <p className="text-sm text-gray-500">
                  Restaurante: {opinion.restaurante}
                </p>
              </div>
            ))}
          </Slider>
        </section>

      </div>
    </>
  );
};

export default HomePage;
