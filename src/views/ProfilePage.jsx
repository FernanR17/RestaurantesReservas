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
        text: "You have to login to view this page.",
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
          text: "Unable to load user's information.",
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
        title: "Profile Updated",
        text: "Your information has been updated successfully.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to update profile.",
      });
    }
  };

  if (!user) {
    return <p className="text-center mt-20">Reloading...</p>;
  }

  if (loading) {
    return <p className="text-center mt-20">Loading profile...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">My Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
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
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
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
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
