import { useEffect, useState } from 'react';
import axios from "axios"

const ModalEditProduct = (props) => {

    const dataProductInit = {
        name: "",
        description: "",
        price: 0
    }
    const [dataProduct, setDataProduct] = useState(dataProductInit);

    const apiUrl = 'http://localhost/products/api.php';
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    const getProduct = async() => {
        const res = await axios.get(`${apiUrl}/productos/${props.idEdit}`, config);
        console.log(res);
        setDataProduct(res.data)
    }

    const handelChange = (e) =>{
        //Actualizando el valor segun propiedad y valor que proviene del input
        setDataProduct({...dataProduct, [e.target.name]: e.target.value})
    }

    const handelSubmit = async (e) =>{
        e.preventDefault();

        await axios.put(`${apiUrl}/productos/${props.idEdit}`,dataProduct, config)
        .then(response => {
            console.log(response);
        })
        .catch((err) => {
            console.error(err);
        });

        props.setShowModal(false);
        props.getAllProducts();
    }

    useEffect(() => {
        getProduct();
    }, [])

    return (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-1/2 my-6 mx-auto">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        {/*header*/}
                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                Editar producto
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-1 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => props.setShowModal(false)}
                            >
                                <span className="bg-transparent text-black opacity-1 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    ×
                                </span>
                            </button>
                        </div>
                        {/*body*/}
                        <div className="flex items-center justify-center w-full">
                            <form onSubmit={handelSubmit} className="w-4/5 mx-auto py-4">
                                <div className="flex flex-wrap -m-2">
                                    <div className="p-2 w-1/2">
                                        <div className="relative">
                                            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Nombre</label>
                                            <input
                                                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={dataProduct.name}
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
                                                value={dataProduct.price}
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
                                                value={dataProduct.description}
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
                    </div>
                </div>
            </div >
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}

export default ModalEditProduct;