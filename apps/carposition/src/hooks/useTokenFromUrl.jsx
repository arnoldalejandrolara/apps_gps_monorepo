import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '@mi-monorepo/common/store/auth';
import { logout } from '@mi-monorepo/common/store/thunks';
import { validateTokenFromUrl } from '@mi-monorepo/common/services';
import { setInitialImei } from '@mi-monorepo/common/store/vehicle';

/**
 * Hook personalizado para capturar y procesar tokens desde la URL
 * Formato esperado: /?t=452qefads
 */
export function useTokenFromUrl() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [tokenProcessed, setTokenProcessed] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('t');

        if (token && !tokenProcessed) {
            dispatch(logout());

            console.log('Token encontrado en URL:', token);
            
            navigate('/loading');
            // Procesar el token aquí
            processTokenFromUrl(token).then(async (userData) => {
                //esperar 3 segundos
                setTimeout(() => { 
                    if (userData && userData.user) {
                        // Hacer login automático con los datos del usuario
                        console.log(userData, "userData");
                        dispatch(login({ user: userData.user, token: userData.user.access_token }));
                        dispatch(setInitialImei(userData.imei));
                        //navigate('/');
                        console.log('Login automático exitoso con token de URL');
                        setTokenProcessed(true);
                        const newSearch = new URLSearchParams(location.search);
                        newSearch.delete('t');
                        const newUrl = location.pathname + (newSearch.toString() ? '?' + newSearch.toString() : '');
                        
                        // Reemplazar la URL sin el token para mantener limpieza
                        navigate('/', { replace: true });
                    } else {
                        console.error('Token inválido o datos de usuario no encontrados');
                        setTokenProcessed(true);
                        navigate('/login');
                    }
                    
                }, 1500);
                
            }).catch((error) => {
                console.error('Error procesando token de URL:', error);
                setTokenProcessed(true);
                navigate('/login');
            });
        }
    }, [location.search, navigate, tokenProcessed]);

    const processTokenFromUrl = async (token) => {
        try {
            console.log('Procesando token:', token);
            
            // Validar el token con el servidor
            const userData = await validateTokenFromUrl(token);
            return userData;
        } catch (error) {
            throw error;
        }
    };

    return {
        tokenProcessed,
        processTokenFromUrl
    };
}
