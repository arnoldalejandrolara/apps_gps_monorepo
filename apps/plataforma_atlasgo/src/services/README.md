# Servicios API - Manejo Automático de Autenticación

## Descripción

Todos los servicios en esta carpeta ahora manejan automáticamente los errores de autenticación (status 401). Cuando se recibe un 401, el sistema:

1. **Hace dispatch del logout** automáticamente
2. **Redirige al usuario** a la página de login usando `navigate` de React Router
3. **Lanza un error** con un mensaje descriptivo

## Archivos Actualizados

- `AlertasService.js` ✅
- `AuthService.js` ✅
- `CuentasEspejoService.js` ✅
- `DispositivosService.js` ✅
- `ReportesService.js` ✅
- `virtualGLTFService.js` (no requiere actualización - no hace llamadas API)

## Nuevos Archivos

- `apiUtils.js` - Manejo centralizado de respuestas API
- `navigationService.js` - Servicio de navegación que permite usar `navigate` desde servicios

## Cómo Funciona

### Antes:
```javascript
const data = await res.json();
if(data.status == 401){
    throw new Error('No autorizado');
} else if(data.status != 200) {
    throw new Error('Error al obtener datos');
}
return data;
```

### Ahora:
```javascript
return await handleApiResponse(res, 'Error al obtener datos');
```

## Navegación Mejorada

### Antes (window.location.href):
```javascript
window.location.href = '/login'; // Recarga la página
```

### Ahora (React Router navigate):
```javascript
navigateToLogin(); // Navegación SPA sin recarga
```

## Beneficios

1. **Código más limpio** - Menos repetición
2. **Manejo consistente** - Todos los servicios manejan 401 igual
3. **Experiencia de usuario mejorada** - Logout automático y redirección SPA
4. **Mantenimiento más fácil** - Cambios centralizados en `apiUtils.js`
5. **Navegación SPA** - Usa React Router en lugar de recargar la página

## Configuración

El servicio de navegación se configura automáticamente en `App.jsx`:

```javascript
import { setNavigate } from './services/navigationService';

function App() {
    const navigate = useNavigate();
    
    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);
    
    // ...
}
```

## Uso en Componentes

Los componentes no necesitan cambios. Simplemente usan los servicios como antes:

```javascript
import { getAlertasList } from '../services/AlertasService';

try {
    const alertas = await getAlertasList(token, lastId);
    // Procesar datos...
} catch (error) {
    // El logout y redirección ya se manejan automáticamente
    console.error('Error:', error.message);
}
``` 