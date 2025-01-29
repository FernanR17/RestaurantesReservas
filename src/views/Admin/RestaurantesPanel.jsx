import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

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
        title: "Error while loading restaurants",
        text: "Unable to get data, please try again later.",
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
          ? "Updating Restaurant..."
          : "Creating Restaurant...",
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
          title: "Updated!",
          text: "Restaurant has been updated successfully.",
        });
      } else {
        // Crear restaurante
        await axios.post(
          "http://localhost/restaurante/api.php/restaurantes",
          formData
        );
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Restaurant has been created successfully.",
        });
      }
      fetchRestaurantes();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error saving restaurant's info",
        text: "Please check your data and try again.",
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the Restaurant permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost/restaurante/api.php/restaurantes/${id}`
          );
          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "Restaurant has been deleted successfully.",
          });
          fetchRestaurantes();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error trying to delete",
            text: "Unable to delete the restaurant, please try again later.",
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
      <h1 className="text-2xl font-bold mb-4">Restaurant Management</h1>
      {/* <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => openModal()}
      >
        Crear Nuevo Restaurante
      </button> */}
      <Link to={"/nuevo-restaurante"}>
                     <button className="flex ml-auto select-none rounded-lg bg-indigo-800 uppercase py-4 px-8 text-center font-sans text-sm font-bold text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20">
                       Register Restaurant
                     </button>
                   </Link>

      <table className="table-auto w-full mt-4 border">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Actions</th>
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
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(restaurante.id_restaurante)}
                >
                  Delete
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
              {selectedRestaurante ? "Edit Restaurant" : "Create Restaurant"}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Name</label>
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
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreateOrUpdate}
              >
                {selectedRestaurante ? "Update" : "Create"}
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
              {selectedRestaurante ? 'Edit Restaurant' : 'Create Restaurant'}
            </h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Location</label>
                <input
                  type="text"
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Category</label>
                <input
                  type="text"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Opening Hours</label>
                <input
                  type="time"
                  name="horario_apertura"
                  value={formData.horario_apertura}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Closing Hours</label>
                <input
                  type="time"
                  name="horario_cierre"
                  value={formData.horario_cierre}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Maximum capacity</label>
                <input
                  type="number"
                  name="capacidad_maxima"
                  value={formData.capacidad_maxima}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">URL Map</label>
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
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreateOrUpdate}
              >
                {selectedRestaurante ? 'Update' : 'Create'}
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
