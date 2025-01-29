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
                    text: "Couldn't load all categories.",
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
                title: "Are you sure?",
                text: "This action will delete this category.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete",
                cancelButtonText: "No, cancel",
            });

            if (confirm.isConfirmed) {
                await axios.delete(`${apiUrl}/categorias/${idCategoria}`);
                setCategorias((prev) => prev.filter((cat) => cat.id_categoria !== idCategoria));
                Swal.fire({
                    title: "Deleted",
                    text: "Category has been deleted successfully.",
                    icon: "success",
                });
            }
        } catch (error) {
            console.error("Error deleting the category:", error);
            Swal.fire({
                title: "Error",
                text: "It wasn't possible to delete this category.",
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
                    title: "Updated",
                    text: "Category has been updated successfully.",
                    icon: "success",
                });
            } else {
                // Crear categoría
                const res = await axios.post(`${apiUrl}/categorias`, modalData);
                setCategorias((prev) => [...prev, res.data]);
                Swal.fire({
                    title: "Created",
                    text: "Category has been created successfully.",
                    icon: "success",
                });
            }
            closeModal();
        } catch (error) {
            console.error("Error saving category:", error);
            Swal.fire({
                title: "Error",
                text: "It wasn't possible to save the category.",
                icon: "error",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-indigo-800">Category Management</h1>
                    <button
                        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaPlus className="mr-2" /> Add Category
                    </button>
                </div>

                <table className="table-auto w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Actions</th>
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
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(categoria.id_categoria)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center"
                                    >
                                        <FaTrash className="mr-1" /> Delete
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
                                <label className="block text-gray-700">Category Name:</label>
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
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                                >
                                    Save
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
