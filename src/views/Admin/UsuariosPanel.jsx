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
        title: "Error al cargar usuarios",
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
        title: selectedUsuario
          ? "Actualizando Usuario..."
          : "Creando Usuario...",
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
          title: "¡Actualizado!",
          text: "El usuario ha sido actualizado correctamente.",
        });
      } else {
        // Crear usuario
        await axios.post("http://localhost/restaurante/api.php/register", formData);
        Swal.fire({
          icon: "success",
          title: "¡Creado!",
          text: "El usuario ha sido creado correctamente.",
        });
      }
      fetchUsuarios();
      closeModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar el usuario",
        text: "Por favor, revisa los datos e intenta nuevamente.",
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost/restaurante/api.php/usuarios/${id}`);
          Swal.fire({
            icon: "success",
            title: "Eliminado",
            text: "El usuario ha sido eliminado correctamente.",
          });
          fetchUsuarios();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: "No se pudo eliminar el usuario. Por favor, intenta nuevamente.",
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
        Crear Nuevo Usuario
      </button>

      <table className="table-auto w-full mt-4 border">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Acciones</th>
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
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(usuario.id_usuario)}
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
              {selectedUsuario ? "Editar Usuario" : "Crear Usuario"}
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
                <label className="block text-sm font-bold mb-2">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Rol</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="cliente">Cliente</option>
                  <option value="restaurante">Restaurante</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {!selectedUsuario && (
                <div className="mb-4">
                  <label className="block text-sm font-bold mb-2">Contraseña</label>
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
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleCreateOrUpdate}
              >
                {selectedUsuario ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPanel;
