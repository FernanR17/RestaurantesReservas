import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RegistrarRestaurante = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    categoria: "",
    horario_apertura: "",
    horario_cierre: "",
    capacidad_maxima: "",
    mapa_url: "",
    imagen: null,
  });

  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  const apiUrl = "http://localhost/restaurante/api.php";

  useEffect(() => {
    // Obtener categorías
    const fetchCategorias = async () => {
      try {
        const res = await axios.get(`${apiUrl}/categorias`);
        setCategorias(res.data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las categorías.",
          icon: "error",
        });
      }
    };

    fetchCategorias();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      imagen: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user")); // Obtén el usuario del localStorage
    if (!user || !user.id_usuario) {
        Swal.fire({
            title: "Error",
            text: "Usuario no válido.",
            icon: "error",
        });
        return;
    }

    const formDataToSend = {
        ...formData,
        id_usuario: user.id_usuario, // Agregar el ID del usuario
    };

    try {
        const response = await axios.post(`${apiUrl}/restaurantes`, formDataToSend);
        if (response.status === 201) {
            Swal.fire({
                title: "Éxito",
                text: "Restaurante registrado correctamente.",
                icon: "success",
            });
            navigate("/catalogo");
        }
    } catch (error) {
        console.error("Error al registrar restaurante:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudo registrar el restaurante.",
            icon: "error",
        });
    }
};


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-indigo-800 mb-6">Registrar Restaurante</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Ubicación</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre_categoria}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Horario de Apertura</label>
          <input
            type="time"
            name="horario_apertura"
            value={formData.horario_apertura}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Horario de Cierre</label>
          <input
            type="time"
            name="horario_cierre"
            value={formData.horario_cierre}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Capacidad Máxima</label>
          <input
            type="number"
            name="capacidad_maxima"
            value={formData.capacidad_maxima}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Mapa (Embed URL)</label>
          <input
            type="text"
            name="mapa_url"
            value={formData.mapa_url}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-gray-700">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="col-span-2 text-right">
          <button
            type="submit"
            className="bg-indigo-800 text-white py-2 px-6 rounded hover:bg-indigo-900"
          >
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarRestaurante;
