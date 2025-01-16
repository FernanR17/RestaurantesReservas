import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { FaBeer } from 'react-icons/fa';


const CategoriasPanel = () => {
    const [categorias, setCategorias] = useState([]);
    const [modalData, setModalData] = useState({ id_categoria: "", nombre_categoria: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const apiUrl = "http://localhost/restaurante/api.php";

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await axios.get(`${apiUrl}/categorias`);
                setCategorias(res.data);
            } catch (error) {
                console.error("Error al cargar las categorías:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron cargar las categorías.",
                    icon: "error",
                });
            }
        };
        fetchCategorias();
    }, []);

    const handleEdit = (categoria) => {
        setModalData(categoria);
        setIsModalOpen(true);
    };

    const handleDelete = async (idCategoria) => {
        try {
            const confirm = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción eliminará la categoría.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "No, cancelar",
            });

            if (confirm.isConfirmed) {
                await axios.delete(`${apiUrl}/categorias/${idCategoria}`);
                setCategorias((prev) => prev.filter((cat) => cat.id_categoria !== idCategoria));
                Swal.fire({
                    title: "Eliminada",
                    text: "La categoría ha sido eliminada.",
                    icon: "success",
                });
            }
        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo eliminar la categoría.",
                icon: "error",
            });
        }
    };

    const closeModal = () => {
        setModalData({ id_categoria: "", nombre_categoria: "" });
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalData.id_categoria) {
                // Actualizar categoría
                await axios.put(`${apiUrl}/categorias/${modalData.id_categoria}`, modalData);
                setCategorias((prev) =>
                    prev.map((cat) =>
                        cat.id_categoria === modalData.id_categoria ? modalData : cat
                    )
                );
                Swal.fire({
                    title: "Actualizada",
                    text: "La categoría ha sido actualizada.",
                    icon: "success",
                });
            } else {
                // Crear categoría
                const res = await axios.post(`${apiUrl}/categorias`, modalData);
                setCategorias((prev) => [...prev, res.data]);
                Swal.fire({
                    title: "Creada",
                    text: "La categoría ha sido creada.",
                    icon: "success",
                });
            }
            closeModal();
        } catch (error) {
            console.error("Error al guardar la categoría:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo guardar la categoría.",
                icon: "error",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-indigo-800">Gestión de Categorías</h1>
                    <button
                        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaPlus className="mr-2" /> Añadir Categoría
                    </button>
                </div>

                <table className="table-auto w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Nombre</th>
                            <th className="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.map((categoria) => (
                            <tr key={categoria.id_categoria} className="text-center">
                                <td className="px-4 py-2 border">{categoria.id_categoria}</td>
                                <td className="px-4 py-2 border">{categoria.nombre_categoria}</td>
                                <td className="px-4 py-2 border flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(categoria)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center"
                                    >
                                        <FaEdit className="mr-1" /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(categoria.id_categoria)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center"
                                    >
                                        <FaTrash className="mr-1" /> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            {modalData.id_categoria ? "Editar Categoría" : "Añadir Categoría"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Nombre de la Categoría</label>
                                <input
                                    type="text"
                                    value={modalData.nombre_categoria || ""}
                                    onChange={(e) =>
                                        setModalData((prev) => ({ ...prev, nombre_categoria: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-700 mr-2"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriasPanel;
