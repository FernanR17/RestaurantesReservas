import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const ProtectedRoute = ({ element: Component, roles, ...rest }) => {
    const { user } = useContext(UserContext);

    // Verifica si el usuario está autenticado y tiene el rol necesario
    if (!user || (roles && !roles.includes(user.rol))) {
        return <Navigate to="/login" replace />;
    }

    // Renderiza el componente si cumple las condiciones
    return <Component {...rest} />;
};

export default ProtectedRoute;
