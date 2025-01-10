import axios from 'axios';
import {useState} from 'react';
import { useNavigate } from "react-router-dom";

const RegisterProduct = () => {

    const navigate = useNavigate();

    const apiUrl = 'http://localhost/products/api.php';
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    const dataProductInit = {
        name: "",
        description: "",
        price: 0,
    }

    const [dataProduct, setDataProduct] = useState(dataProductInit);

    const handelChange = (e) =>{
        //Actualizando el valor segun propiedad y valor que proviene del input
        setDataProduct({...dataProduct, [e.target.name]: e.target.value});
    }

    const handelSubmit = async (e) =>{
        e.preventDefault();
        console.log(dataProduct);
        await axios.post(`${apiUrl}/productos`, dataProduct, config)
        .then(response =>{
            console.log(response);
            navigate('/catalogo');
        })
        .catch(err =>{
            console.log(err);
        })
    }

    return (
        <section className="text-gray-600 body-font relative">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-12">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Registrar Producto</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Ingrese los nuevos datos del porducto.</p>
                </div>
                <form onSubmit={handelSubmit} className="lg:w-1/2 md:w-2/3 mx-auto">
                    <div className="flex flex-wrap -m-2">
                        <div className="p-2 w-1/2">
                            <div className="relative">
                                <label htmlFor="name" className="leading-7 text-sm text-gray-600">Nombre</label>
                                <input 
                                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    onChange={handelChange}
                                    placeholder='Ingresar el nombre del producto'
                                    required
                                />
                            </div>
                        </div>
                        <div className="p-2 w-1/2">
                            <div className="relative">
                                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Precio</label>
                                <input 
                                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    type="number" 
                                    id="price" 
                                    name="price"
                                    onChange={handelChange}
                                    placeholder='00.00'
                                    required
                                />
                            </div>
                        </div>
                        <div className="p-2 w-full">
                            <div className="relative">
                                <label htmlFor="description" className="leading-7 text-sm text-gray-600">Descripción</label>
                                <textarea 
                                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                    id="description" 
                                    name="description" 
                                    onChange={handelChange}
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-2 w-full">
                            <button type='submit' className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Registrar Producto</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default RegisterProduct;