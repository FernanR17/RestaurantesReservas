import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegisterPage = () => {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [telefono, setTelefono] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos vacíos
        if (!nombre && !email && !password && !telefono) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Todos los campos son obligatorios.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            return;
        }

        if (!nombre) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "El campo 'Nombre' es obligatorio.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            return;
        }

        if (!email) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "El campo 'Correo Electrónico' es obligatorio.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Por favor, introduce un correo electrónico válido.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            return;
        }

        if (!telefono) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "El campo 'Teléfono' es obligatorio.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            return;
        }

        const phoneRegex = /^[0-9]{8}$/; // 8 dígitos numéricos
        if (!phoneRegex.test(telefono)) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "El teléfono debe contener exactamente 8 dígitos numéricos.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            return;
        }

        if (!password) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "El campo 'Contraseña' es obligatorio.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            return;
        }

        if (password.length < 6) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "La contraseña debe tener al menos 6 caracteres.",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
            return;
        }

        Swal.fire({
            title: "Procesando registro...",
            html: "Espere un momento.",
            timer: 1500, // La duración de esta alerta
            timerProgressBar: true,
            showClass: {
                popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `
            },
            hideClass: {
                popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `
            },
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                Swal.hideLoading();
            },
        }).then(async () => {
            // Este bloque se ejecuta después de que la alerta de "Procesando registro..." se cierra
            try {
                await axios.post(
                    "http://localhost/restaurante/api.php/register",
                    {
                        nombre,
                        email,
                        password,
                        telefono,
                    }
                );

                // Mostrar alerta de éxito tras el registro
                Swal.fire({
                    title: "Registro Exitoso",
                    text: "Tu cuenta ha sido creada exitosamente.",
                    icon: "success",
                    timer: 2000,
                    showClass: {
                        popup: `
                          animate__animated
                          animate__fadeInUp
                          animate__faster
                        `,
                    },
                    hideClass: {
                        popup: `
                          animate__animated
                          animate__fadeOutDown
                          animate__faster
                        `,
                    },
                    showConfirmButton: false,
                    timerProgressBar: true,
                }).then(() => {
                    navigate("/login"); // Redirigir al login tras el registro exitoso
                });
            } catch (error) {
                // Mostrar alertas de error si ocurre un problema
                if (error.response?.status === 400 && error.response?.data?.error) {
                    Swal.fire({
                        icon: "warning",
                        title: "Correo ya registrado",
                        text: error.response.data.error,
                        showConfirmButton: true,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Algo salió mal. Inténtalo de nuevo.",
                        text: error.response?.data?.error || "",
                        showConfirmButton: true,
                    });
                }
            }
        });

    };


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold text-center text-indigo-800 mb-6">
                    Crear Cuenta
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Ingrese su nombre"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Ingrese su correo electrónico"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Teléfono</label>
                        <input
                            type="text"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Ingrese su número de teléfono"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                            placeholder="Cree una contraseña"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg"
                    >
                        Registrarse
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    ¿Ya tienes una cuenta?{" "}
                    <a
                        href="/login"
                        className="text-indigo-800 font-bold hover:underline"
                    >
                        Inicia Sesión
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
