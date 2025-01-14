import { useState, useContext } from 'react';
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { UserContext } from '../context/UserContext';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const { login } = useContext(UserContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!email && !password) {
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Introduce un correo electrónico válido.",
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

        // Mostrar alerta de carga
        Swal.fire({
            title: "Procesando...",
            html: "Verificando credenciales.",
            timer: 1500,
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
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
        }).then(async () => {
            try {
                const response = await axios.post(
                    'http://localhost/restaurante/api.php/auth/login',
                    { email, password }
                );

                if (response.data?.user) {
                    const { user } = response.data;
                    const userData = response.data.user;
                    login(userData);

                    Swal.fire({
                        title: "Inicio de sesión exitoso",
                        text: `Bienvenido, ${user.nombre}`,
                        icon: "success",
                        timer: 2500,
                        showConfirmButton: false,
                        timerProgressBar: true,
                    }).then(() => {
                        // Redirección basada en rol
                        if (user.rol === 'cliente') {
                            navigate('/catalogo');
                        } else if (user.rol === 'restaurante') {
                            navigate('/dashboard/restaurante');
                        } else if (user.rol === 'admin') {
                            navigate('/admin');
                        }
                    });
                } else {
                    Swal.fire({
                        title: "Error de inicio de sesión",
                        text: "No se pudo autenticar al usuario.",
                        icon: "error",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                }
            } catch (error) {

                if (error.response?.status === 401) {
                    Swal.fire({
                        title: "Error de credenciales",
                        text: "Correo o contraseña incorrectos.",
                        icon: "error",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "Algo salió mal. Inténtalo nuevamente.",
                        icon: "error",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                }
            }
        });


    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold text-center text-indigo-800 mb-6">
                    Iniciar Sesión
                </h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Correo Electrónico</label>
                        <input
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Contraseña</label>
                        <input
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 px-4 rounded-lg w-full font-bold hover:bg-indigo-700"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <p className="text-center text-gray-600 mt-4">
                    ¿No tienes una cuenta? {" "}
                    <Link
                        to="/register"
                        className="text-indigo-800 font-bold hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
