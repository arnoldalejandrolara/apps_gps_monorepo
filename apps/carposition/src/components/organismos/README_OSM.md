# OpenStreetMap (OSM) Implementation

Este documento describe cómo usar la implementación de OpenStreetMap en tu aplicación.

## Características implementadas

✅ **Mapa base OSM** - Tiles gratuitos de OpenStreetMap  
✅ **Selector de mapas** - Cambio dinámico entre Google Maps y OSM  
✅ **Marcadores de vehículos** - Iconos personalizados para vehículos  
✅ **Popups informativos** - Información del vehículo al hacer clic  
✅ **Sincronización de vista** - Estado de vista compartido entre mapas  
✅ **Diseño responsivo** - Funciona en desktop y móvil  

## Cómo usar

### 1. Selector de mapa
Un botón flotante en la esquina superior derecha permite cambiar entre:
- **Google Maps** - Usando la API de Google Maps 
- **OpenStreetMap** - Usando tiles gratuitos de OSM

### 2. Funcionalidades del mapa OSM
- **Zoom y paneo** - Navegación completa con mouse/touch
- **Marcadores de vehículos** - Se muestran automáticamente los vehículos seleccionados
- **Popups** - Clic en marcador muestra información del vehículo
- **Sincronización** - Al cambiar de mapa, mantiene la misma vista

### 3. Personalización

#### Cambiar el estilo del mapa
En `OSMMap.jsx`, puedes cambiar la URL de tiles:

```jsx
// Mapa estándar OSM
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

// Otras opciones gratuitas:
// CartoDB Positron (claro)
url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

// CartoDB Dark Matter (oscuro)  
url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"

// OpenTopoMap (topográfico)
url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
```

#### Personalizar marcadores de vehículos
En `OSMMap.jsx`, modifica `vehicleIcon`:

```jsx
const vehicleIcon = L.divIcon({
  className: 'vehicle-marker',
  html: `<div style="...">Tu HTML personalizado</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});
```

## Ventajas de OSM vs Google Maps

### OpenStreetMap ✅
- ✅ **Gratuito** - Sin límites de uso ni API keys
- ✅ **Open Source** - Datos abiertos y modificables
- ✅ **Sin restricciones** - No hay límites de requests
- ✅ **Privacidad** - No rastrea usuarios
- ✅ **Personalizable** - Múltiples estilos disponibles

### Google Maps ⚠️
- ⚠️ **Costo** - Requiere API key y tiene límites/costos
- ✅ **Calidad** - Imágenes satelitales de alta calidad
- ✅ **Funciones avanzadas** - Street View, direcciones, etc.
- ⚠️ **Restricciones** - Términos de servicio estrictos

## Dependencias añadidas

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^5.0.0"
}
```

## Archivos creados/modificados

- `components/organismos/OSMMap.jsx` - Componente principal del mapa OSM
- `components/atomos/MapTypeSelector.jsx` - Selector entre Google Maps y OSM  
- `styled-components/leaflet.css` - Estilos específicos para Leaflet
- `templates/HomeTemplate.jsx` - Integración de OSM con selector

## Soporte y compatibilidad

- ✅ **React 19** - Compatible con la versión actual
- ✅ **Mobile** - Funciona en dispositivos móviles
- ✅ **Desktop** - Funciona en navegadores modernos
- ✅ **Performance** - Optimizado para cargas rápidas

## Próximos pasos sugeridos

1. **Rutas y navegación** - Agregar trazado de rutas entre puntos
2. **Clustering** - Agrupar marcadores cuando hay muchos vehículos
3. **Capas adicionales** - Tráfico, puntos de interés, etc.
4. **Controles personalizados** - Botones de zoom, ubicación actual
5. **Offline support** - Cache de tiles para uso sin internet
