import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const PerfilRestaurante = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        ubicacion: "",
        categoria: "",
        horario_apertura: "",
        horario_cierre: "",
        descripcion: "",
        capacidad_maxima: "",
        mapa_url: "",
        imagen: null, // Este valor puede ser null ya que no es directamente visible en un input
    });
    console.log("Datos enviados al servidor:", formData);

    const [categorias, setCategorias] = useState([]);
    const [imagenPrevia, setImagenPrevia] = useState(null);
    const navigate = useNavigate();

    const apiUrl = "http://localhost/restaurante/api.php";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.id_usuario) throw new Error("Usuario no válido");

                // Obtener información del restaurante
                const resRestaurante = await axios.get(`${apiUrl}/restaurantes?usuario=${user.id_usuario}`);
                setFormData({
                    ...resRestaurante.data,
                    nombre: resRestaurante.data.nombre || "",
                    ubicacion: resRestaurante.data.ubicacion || "",
                    categoria: resRestaurante.data.categoria || "",
                    horario_apertura: resRestaurante.data.horario_apertura || "",
                    horario_cierre: resRestaurante.data.horario_cierre || "",
                    descripcion: resRestaurante.data.descripcion || "",
                    capacidad_maxima: resRestaurante.data.capacidad_maxima || "",
                    mapa_url: resRestaurante.data.mapa_url || "",
                    imagen: null, // Resetear imagen para evitar conflictos
                });
                setImagenPrevia(resRestaurante.data.imagen_url || null);

                // Obtener categorías
                const resCategorias = await axios.get(`${apiUrl}/categorias`);
                setCategorias(resCategorias.data);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron cargar los datos del restaurante.",
                    icon: "error",
                });
            }
        };

        fetchData();
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

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenPrevia(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.id_usuario) throw new Error("Usuario no válido");

            // Validar si el mapa_url tiene un iframe válido
            if (
                formData.mapa_url &&
                !/^<iframe.*src="https:\/\/www\.google\.com\/maps\/embed\?pb=/.test(
                    formData.mapa_url
                )
            ) {
                Swal.fire({
                    title: "Error",
                    text: "Por favor, ingrese un código embed válido para el mapa.",
                    icon: "error",
                });
                return;
            }

            const formDataToSend = new FormData();
            for (const key in formData) {
                if (key === "imagen" && formData.imagen) {
                    formDataToSend.append(key, formData.imagen);
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }

            const restauranteId = formData.id_restaurante;

            await axios.put(`${apiUrl}/restaurantes/${restauranteId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                title: "Éxito",
                text: "La información del restaurante se ha actualizado correctamente.",
                icon: "success",
            });

            navigate("/dashboard/restaurante");
        } catch (error) {
            console.error("Error al guardar cambios:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudieron guardar los cambios.",
                icon: "error",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-indigo-800 mb-6">Editar Perfil del Restaurante</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Ubicación</label>
                    <input
                        type="text"
                        name="ubicacion"
                        value={formData.ubicacion || ""}
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
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="">Seleccione una categoría</option>
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
                        value={formData.horario_apertura || ""}
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
                        value={formData.horario_cierre || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="block text-gray-700">Capacidad Máxima</label>
                    <input
                        type="number"
                        name="capacidad_maxima"
                        value={formData.capacidad_maxima || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700">Mapa (Embed Code)</label>
                    <input
                        type="text"
                        name="mapa_url"
                        value={formData.mapa_url || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder='Pega aquí el código embed del mapa'
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-gray-700">Imagen del Restaurante</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {imagenPrevia && (
                        <img
                            src={imagenPrevia}
                            alt="Imagen del Restaurante"
                            className="mt-4 w-48 h-48 object-cover border border-gray-300 rounded"
                        />
                    )}
                </div>

                <div className="col-span-2 text-right">
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-800"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PerfilRestaurante;
