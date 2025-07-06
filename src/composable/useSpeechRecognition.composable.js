import { ref, onUnmounted } from "vue";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { Notify } from "quasar";
import { App } from "@capacitor/app";

export default function useSpeechRecognition() {
  const isListening = ref(false);
  const recognizedText = ref("");
  const recognitionError = ref(null);
  const permissionGranted = ref(false);
  const needsManualPermission = ref(false);

  const recognitionOptions = ref({
    language: "es-ES",
    partialResults: true,
    popup: false,
    continuous: true, // Set continuous to true by default for always-on listening
  });

  // Removed targetText, lastRecognizedCommand, isMatch, setTargetText, setOnMatchCallback
  // The consumer (IndexPage) will handle matching against multiple commands

  // Verificar y solicitar permisos con manejo completo para Android
  const checkPermissions = async () => {
    needsManualPermission.value = false;
    try {
      const available = await SpeechRecognition.available();
      if (!available.available) {
        Notify.create({
          type: "negative",
          message:
            "El reconocimiento de voz no está disponible en este dispositivo.",
        });
        permissionGranted.value = false;
        return false;
      }

      const status = await SpeechRecognition.checkPermissions();
      if (status.speechRecognition === "granted") {
        permissionGranted.value = true;
        return true;
      }

      if (status.speechRecognition === "denied") {
        Notify.create({
          type: "negative",
          message:
            "Permiso de micrófono denegado permanentemente. Por favor, habilítalo manualmente en la configuración de la app.",
          timeout: 7000,
        });
        needsManualPermission.value = true;
        permissionGranted.value = false;
        return false;
      }

      // Estado "prompt" o no concedido: solicitar permiso
      const requestStatus = await SpeechRecognition.requestPermissions();
      if (requestStatus.speechRecognition === "granted") {
        permissionGranted.value = true;
        return true;
      } else {
        Notify.create({
          type: "negative",
          message: "Permiso de micrófono denegado.",
        });
        needsManualPermission.value = true;
        permissionGranted.value = false;
        return false;
      }
    } catch (error) {
      recognitionError.value =
        error?.message || "Error desconocido al solicitar permisos";
      Notify.create({
        type: "negative",
        message: `Error de permisos: ${recognitionError.value}`,
      });
      permissionGranted.value = false;
      return false;
    }
  };

  // Abrir ajustes de la app para que el usuario habilite el permiso manualmente
  const openAppSettings = async () => {
    try {
      await App.openUrl({ url: "app-settings:" });
    } catch {
      Notify.create({
        type: "negative",
        message: "No se pudo abrir la configuración de la aplicación.",
      });
    }
  };

  const startRecognition = async (customOptions = {}) => {
    if (isListening.value) return;

    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) return false;

      recognitionError.value = null;
      recognizedText.value = "";

      const options = {
        ...recognitionOptions.value,
        ...customOptions,
        continuous: true,
      };

      SpeechRecognition.removeAllListeners();
      SpeechRecognition.addListener("partialResults", handleSpeechResult);
      SpeechRecognition.addListener("result", handleSpeechResult);
      SpeechRecognition.addListener("error", handleRecognitionError);
      SpeechRecognition.addListener("end", handleRecognitionEnd);

      await SpeechRecognition.start(options);
      isListening.value = true;
      return true;
    } catch (error) {
      handleRecognitionError(error);
      return false;
    }
  };

  // Manejador mejorado para el evento "end"
  function handleRecognitionEnd() {
    console.log("Reconocimiento finalizado automáticamente");
    isListening.value = false;

    // Solo reiniciar si no fue una parada manual
    if (!manuallyStopped) {
      setTimeout(() => {
        if (!isListening.value && permissionGranted.value) {
          startRecognition();
        }
      }, 500);
    }
  }

  // Bandera para detectar paradas manuales
  let manuallyStopped = false;

  const stopRecognition = async () => {
    if (!isListening.value) return;

    manuallyStopped = true;

    try {
      await SpeechRecognition.stop();
    } catch (error) {
      console.warn("Error al detener reconocimiento:", error);
    } finally {
      isListening.value = false;
      manuallyStopped = false;
      SpeechRecognition.removeAllListeners();
    }
  };

  function handleSpeechResult(result) {
    const text = result?.matches?.[0] || result?.value || "";
    recognizedText.value = text;
    console.log("handleSpeechResult: Recognized text:", text);
    // In continuous mode, we don't stop on match here.
    // The consumer (IndexPage) will handle the matching logic.
  }

  function handleRecognitionError(error) {
    const errorMessage = error?.message || error?.error || "Error desconocido";
    recognitionError.value = errorMessage;
    isListening.value = false;

    console.error("handleRecognitionError:", errorMessage);

    // Manejo específico de errores comunes
    if (
      errorMessage.includes("no speech") ||
      errorMessage.includes("No match")
    ) {
      // No es un error crítico, intenta reiniciar
      setTimeout(() => {
        if (!isListening.value) {
          startRecognition();
        }
      }, 500);
    } else if (errorMessage.includes("Not allowed")) {
      Notify.create({
        type: "negative",
        message: "Permiso de micrófono denegado",
        timeout: 3000,
      });
    } else {
      Notify.create({
        type: "negative",
        message: `Error: ${errorMessage}`,
        timeout: 3000,
      });
    }
  }

  onUnmounted(() => {
    console.log(
      "useSpeechRecognition composable unmounted. Stopping recognition."
    );
    stopRecognition();
  });

  return {
    isListening,
    recognizedText,
    recognitionError,
    permissionGranted,
    needsManualPermission,
    startRecognition,
    stopRecognition,
    recognitionOptions,
    openAppSettings,
  };
}
