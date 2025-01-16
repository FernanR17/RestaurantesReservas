import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const RestaurantesPanel = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    categoria: "",
    horario_apertura: "",
    horario_cierre: "",
    descripcion: "",
    capacidad_maxima: "",
    id_usuario: "",
    id_categoria: "",
    mapa_url: "",
  });
  const [selectedRestaurante, setSelectedRestaurante] = useState(null);

  useEffect(() => {
    fetchRestaurantes();
  }, []);

  const fetchRestaurantes = async () => {
    try {
      const response = await axios.get(
        "http://localhost/restaurante/api.php/restaurantes"
      );
      setRestaurantes(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar restaurantes",
        text: "No se pudieron obtener los datos. Por favor, intenta nuevamente.",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateOrUpdate = async () => {
    try {
      Swal.fire({
        title: selectedRestaurante
          ? "Actualizando Restaurante..."
          : "Creando Restaurante...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (selectedRestaurante) {
        // Actualizar restaurante
        await axios.put(
          `http://localhost/restaurante/api.php/restaurantes/${selectedRestaurante.id_restaurante}`,
          formData
        );
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "El restaurante ha sido actualizado correctamente.",
        });
      } else {
        // Crear restaurante
        await axios.post(
          "http://localhost/restaurante/api.php/restaurantes",
          formData
        );
        Swal.fire({
          icon: "success",
          title: "¡Creado!",
          text: "El restaurante ha sido creado correctamente.",
        });
      }
      fetchRestaurantes();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar el restaurante",
        text: "Por favor, revisa los datos e intenta nuevamente.",
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el restaurante permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost/restaurante/api.php/restaurantes/${id}`
          );
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El restaurante ha sido eliminado correctamente.",
          });
          fetchRestaurantes();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: "No se pudo eliminar el restaurante. Por favor, intenta nuevamente.",
          });
        }
      }
    });
  };

  const openModal = (restaurante = null) => {
    setSelectedRestaurante(restaurante);
    setFormData(
      restaurante || {
        nombre: "",
        ubicacion: "",
        categoria: "",
        horario_apertura: "",
        horario_cierre: "",
        descripcion: "",
        capacidad_maxima: "",
        id_usuario: "",
        id_categoria: "",
        mapa_url: "",
      }
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRestaurante(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Restaurantes</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => openModal()}
      >
        Crear Nuevo Restaurante
      </button>

      <table className="table-auto w-full mt-4 border">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Ubicación</th>
            <th className="px-4 py-2">Categoría</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {restaurantes.map((restaurante) => (
            <tr key={restaurante.id_restaurante} className="border-t">
              <td className="px-4 py-2">{restaurante.nombre}</td>
              <td className="px-4 py-2">{restaurante.ubicacion}</td>
              <td className="px-4 py-2">{restaurante.categoria}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => openModal(restaurante)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(restaurante.id_restaurante)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">
              {selectedRestaurante ? "Editar Restaurante" : "Crear Restaurante"}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* Repite los campos restantes según la estructura */}
            </form>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreateOrUpdate}
              >
                {selectedRestaurante ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

{modalVisible && (
        <>
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 shadow-lg z-60 w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">
              {selectedRestaurante ? 'Editar Restaurante' : 'Crear Restaurante'}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Ubicación</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Categoría</label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Horario de Apertura</label>
                <input
                  type="time"
                  name="horario_apertura"
                  value={formData.horario_apertura}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Horario de Cierre</label>
                <input
                  type="time"
                  name="horario_cierre"
                  value={formData.horario_cierre}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Capacidad Máxima</label>
                <input
                  type="number"
                  name="capacidad_maxima"
                  value={formData.capacidad_maxima}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Mapa URL</label>
                <input
                  type="text"
                  name="mapa_url"
                  value={formData.mapa_url}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </form>
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreateOrUpdate}
              >
                {selectedRestaurante ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default RestaurantesPanel;
