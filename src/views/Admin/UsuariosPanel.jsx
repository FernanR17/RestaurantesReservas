import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UsuariosPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    rol: "cliente", // Valores posibles: cliente, restaurante, admin
    password: "",
  });
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost/restaurante/api.php/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error loading users",
        text: "Unable to get users' data, please try again later.",
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
        title: selectedUsuario
          ? "Updating User..."
          : "Creating User...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (selectedUsuario) {
        // Actualizar usuario
        await axios.put(
          `http://localhost/restaurante/api.php/usuarios/${selectedUsuario.id_usuario}`,
          formData
        );
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "User has been updated successfully.",
        });
      } else {
        // Crear usuario
        await axios.post("http://localhost/restaurante/api.php/register", formData);
        Swal.fire({
          icon: "success",
          title: "Created!",
          text: "User has been created successfully.",
        });
      }
      fetchUsuarios();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error saving user's information",
        text: "Please, check your data and try again.",
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will delete the user permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "No, Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost/restaurante/api.php/usuarios/${id}`);
          Swal.fire({
            icon: "success",
            title: "Deleted",
            text: "User has been deleted successfully.",
          });
          fetchUsuarios();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error while deleting",
            text: "Unable to delete user's data, please try again later.",
          });
        }
      }
    });
  };

  const openModal = (usuario = null) => {
    setSelectedUsuario(usuario);
    setFormData(
      usuario || {
        nombre: "",
        email: "",
        telefono: "",
        rol: "cliente",
        password: "",
      }
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUsuario(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => openModal()}
      >
        Create new user
      </button>

      <table className="table-auto w-full mt-4 border">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone number</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario} className="border-t">
              <td className="px-4 py-2">{usuario.nombre}</td>
              <td className="px-4 py-2">{usuario.email}</td>
              <td className="px-4 py-2">{usuario.telefono}</td>
              <td className="px-4 py-2">{usuario.rol}</td>
              <td className="px-4 py-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => openModal(usuario)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(usuario.id_usuario)}
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
              {selectedUsuario ? "Editar Usuario" : "Crear Usuario"}
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
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Phone Number</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Role</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="cliente">Client</option>
                  <option value="restaurante">Restaurant</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              {!selectedUsuario && (
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              )}
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
                {selectedUsuario ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPanel;
