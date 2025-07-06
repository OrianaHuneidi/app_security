import { ref } from "vue";
import { Geolocation } from "@capacitor/geolocation";
import { Device } from "@capacitor/device";
import { Loading, Notify } from "quasar";

// Opcional: Configura tu API key de Google aquí
// const GOOGLE_API_KEY = "AIzaSyC8dWmGY4bFsYefLmEevQSFNC7ZhvE-e5c";

export function useGeolocation() {
  const address = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const getExactAddress = async () => {
    try {
      loading.value = true;
      error.value = null;
      Loading.show({ message: "Obteniendo ubicación..." });

      // 1. Verificar permisos
      await checkPermissions();

      // 2. Obtener coordenadas
      const coords = await getCurrentPosition();

      // 3. Obtener dirección
      address.value = await reverseGeocode(coords);

      return address.value;
    } catch (err) {
      error.value = err.message;
      Notify.create({
        type: "negative",
        message: `Error: ${err.message}`,
        position: "top",
      });
      throw err;
    } finally {
      loading.value = false;
      Loading.hide();
    }
  };

  const checkPermissions = async () => {
    const permissionStatus = await Geolocation.checkPermissions();

    if (permissionStatus.location !== "granted") {
      const requestStatus = await Geolocation.requestPermissions();

      if (requestStatus.location !== "granted") {
        throw new Error("Permiso de ubicación denegado");
      }
    }
  };

  const getCurrentPosition = async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (err) {
      throw new Error(`No se pudo obtener la posición: ${err.message}`);
    }
  };

  //   const reverseGeocode = async (coords) => {
  //     try {
  //       // Usando el servicio de Google Maps Geocoding
  //       const response = await fetch(
  //         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${GOOGLE_API_KEY}&language=es`
  //       );

  //       const data = await response.json();

  //       if (data.status !== "OK" || !data.results.length) {
  //         throw new Error("No se encontraron resultados de dirección");
  //       }

  //       return data.results[0].formatted_address;
  //     } catch (err) {
  //       throw new Error(`Geocodificación fallida: ${err.message}`);
  //     }
  //   };

  const reverseGeocode = async (coords) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`
    );

    const data = await response.json();
    return data.display_name;
  };

  return {
    getExactAddress,
    address,
    loading,
    error,
  };
}
