import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(`http://localhost/restaurante/api.php/restaurantes/${id}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (!restaurant) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{restaurant.nombre}</h1>
      <p>{restaurant.descripcion}</p>
      <p>Categoría: {restaurant.categoria}</p>
      <p>Ubicación: {restaurant.ubicacion}</p>
      <p>Horario: {restaurant.horario_apertura} - {restaurant.horario_cierre}</p>
    </div>
  );
};

export default RestaurantDetails;
