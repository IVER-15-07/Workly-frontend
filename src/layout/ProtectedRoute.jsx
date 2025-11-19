import { useEffect, useState } from 'react';
import { authService} from '../api/services/auth.api';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);


    useEffect(() => {
        const checkAuth = () => {
            const user = authService.isAuthenticated();
            setIsAuthenticated(!!user);
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-2 text-slate-200">Verificando autenticación...</p>
                </div>
            </div>
        );
    }
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};


export default ProtectedRoute
