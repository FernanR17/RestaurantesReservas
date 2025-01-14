import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";

const ProfilePage = () => {
  const { user } = useContext(UserContext); // Obtener usuario del contexto
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });

  const apiUrl = "http://localhost/restaurante/api.php";

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debes iniciar sesión para acceder a esta página.",
      });
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${apiUrl}/usuarios/${user.id_usuario}`);
        setProfile(res.data);
        setFormData({
          nombre: res.data.nombre,
          email: res.data.email,
          telefono: res.data.telefono,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información del usuario.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await axios.put(`${apiUrl}/usuarios/${user.id_usuario}`, formData);
      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Tu información ha sido actualizada correctamente.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el perfil.",
      });
    }
  };

  if (!user) {
    return <p className="text-center mt-20">Redirigiendo...</p>;
  }

  if (loading) {
    return <p className="text-center mt-20">Cargando perfil...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">Mi Perfil</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-800"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
