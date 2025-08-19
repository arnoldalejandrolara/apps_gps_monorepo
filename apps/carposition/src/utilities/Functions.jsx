/**
 * Traduce un valor de orientación (en grados) a un punto cardinal en español.
 * @param {number} orientation - El valor de orientación en grados.
 * @returns {string} El punto cardinal correspondiente.
 */
export function getOrientation(orientation) {
    // Normalizar la orientación a un valor entre 0 y 360
    const normalizedOrientation = ((orientation % 360) + 360) % 360;

    // Definir los rangos para cada dirección
    if (normalizedOrientation >= 337.5 || normalizedOrientation < 22.5) return "Norte";
    if (normalizedOrientation >= 22.5 && normalizedOrientation < 67.5) return "Noreste";
    if (normalizedOrientation >= 67.5 && normalizedOrientation < 112.5) return "Este";
    if (normalizedOrientation >= 112.5 && normalizedOrientation < 157.5) return "Sureste";
    if (normalizedOrientation >= 157.5 && normalizedOrientation < 202.5) return "Sur";
    if (normalizedOrientation >= 202.5 && normalizedOrientation < 247.5) return "Suroeste";
    if (normalizedOrientation >= 247.5 && normalizedOrientation < 292.5) return "Oeste";
    if (normalizedOrientation >= 292.5 && normalizedOrientation < 337.5) return "Noroeste";

    return "Desconocido"; // Fallback por si acaso
}

/**
 * Función para calcular la diferencia entre una fecha dada y la fecha actual.
 *
 * @param {string} givenDate - Fecha inicial en formato ISO (por ejemplo, "2025-04-04T17:54:03.000Z").
 * @returns {Object} - Objeto con la diferencia en años, meses, días, horas, minutos, segundos y un mensaje descriptivo.
 */
export const calculateDateDifference = (givenDate) => {
    if (!givenDate) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, message: "No disponible" };
    
    const startDate = new Date(givenDate);
    const currentDate = new Date(); // Fecha y hora actual
  
    // Calcular diferencias
    const differenceInMilliseconds = currentDate - startDate;
  
    const years = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    const months = Math.floor(
      (differenceInMilliseconds % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44)
    );
    const days = Math.floor(
      (differenceInMilliseconds % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24)
    );
    const hours = Math.floor(
      (differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
      (differenceInMilliseconds % (1000 * 60)) / 1000
    );
  
    // Generar el mensaje descriptivo
    let message = "";
    if (years >= 1) {
      message = years === 1 ? "Hace 1 año" : `Hace ${years} años`;
    } else if (months >= 1) {
      message = months === 1 ? "Hace 1 mes" : `Hace ${months} meses`;
    } else if (days >= 15) {
      message = `Hace ${days} días`;
    } else if (days >= 1) {
      message = `Hace ${days} día(s)`;
    } else if (hours >= 1) {
      message = `Hace ${hours} hora(s)`;
    } else if (minutes > 5) {
      message = `Hace ${minutes} minuto(s)`;
    } else if (minutes <= 5 && minutes > 0) {
      message = "Hace unos momentos";
    } else {
      message = "Hace un instante";
    }
  
    return { years, months, days, hours, minutes, seconds, message };
  };

/* Helper function to darken button colors */
export function darkenColor(hex, amount = 20) {
    let num = parseInt(hex.replace("#", ""), 16);
    let r = Math.max((num >> 16) - amount, 0);
    let g = Math.max(((num >> 8) & 0x00ff) - amount, 0);
    let b = Math.max((num & 0x0000ff) - amount, 0);
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}

export function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return [r, g, b];
}

/**
 * Convierte una fecha UTC a la zona horaria local con formato legible
 * @param {string} utcDate - Fecha en formato UTC (ej: "2024-03-14T15:30:00.000Z")
 * @returns {string} Fecha formateada en la zona horaria local (ej: "14/03/2024 10:30 AM")
 */
export function formatLocalDate(utcDate) {
    if (!utcDate) return "N/A";
    
    try {
        const date = new Date(utcDate);
        
        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            console.warn('Invalid date:', utcDate);
            return "Fecha inválida";
        }

        // Obtener los componentes de la fecha en la zona horaria local
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        // Formatear la fecha como "DD/MM/YYYY HH:mm"
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return "Error al formatear fecha";
    }
}

