<template>
  <q-page class="flex flex-center">
    <div class="flex flex-col items-center gap-6">
      <q-btn
        round
        align="right"
        color="pink"
        label="Llamada"
        size="18px"
        class="!rounded-full !mb-4 !py-4 !px-14 !bg-gradient-to-r !from-[#d1bef8] !to-[#8f2dff] !min-w-[200px] !pl-6 flex items-center justify-between !relative"
        @click="makeCall"
      >
        <template v-slot:default>
          <div class="absolute right-0 rounded-full bg-white mx-2">
            <q-icon class="text-[#8700ff] !p-2" name="call" size="30px" />
          </div>
        </template>
      </q-btn>
      <div>
        <q-btn
          color="primary"
          label="Mensaje"
          size="18px"
          class="!rounded-full !mb-4 !py-4 !px-14 !bg-gradient-to-r !from-[#fdbceb] !to-[#b740ff] !min-w-[200px] !pr-4 flex items-center justify-between !relative"
          @click="sendSms"
        >
          <template v-slot:default>
            <div class="absolute left-0 rounded-full bg-white mx-2">
              <q-icon
                class="text-[#ff60e1] !p-2"
                name="chat_bubble"
                size="30px"
              />
            </div>
          </template>
        </q-btn>
      </div>
      <q-btn
        color="primary"
        label="Alarma"
        size="18px"
        class="!rounded-full !py-4 !px-14 !bg-gradient-to-r !from-[#ffb5b5] !to-[#ff1717] !min-w-[200px] !pl-6 flex items-center justify-between !relative"
        @click="playAlarm"
        :disable="isAlarmPlaying"
      >
        <template v-slot:default>
          <div class="absolute right-0 rounded-full bg-white mx-2">
            <q-icon
              class="text-[#ff1717] !p-2"
              name="notifications"
              size="30px"
            />
          </div>
        </template>
      </q-btn>
    </div>
    <q-btn
      v-if="isAlarmPlaying"
      round
      color="red"
      icon="stop"
      size="md"
      class="absolute-bottom-right q-ma-md"
      @click="stopAlarm"
    />

    <!-- New button for microphone control -->
    <div class="absolute-bottom flex flex-center q-mb-xl" style="width: 100%">
      <q-btn
        round
        :color="isListening ? 'red' : 'green'"
        :icon="isListening ? 'mic' : 'mic_off'"
        size="lg"
        @click="toggleRecognition"
      >
        <q-tooltip>
          {{ isListening ? "Detener micrófono" : "Activar micrófono" }}
        </q-tooltip>
      </q-btn>
    </div>

    <!-- Mensaje de estado del micrófono -->
    <div
      v-if="showMicStatus"
      class="absolute-top text-center q-mt-md"
      :class="statusClass"
    >
      {{ micStatusMessage }}
    </div>
  </q-page>
</template>

<script setup>
import { SmsManager } from "@byteowls/capacitor-sms";
import { Notify } from "quasar";
import { useConfigStore } from "src/stores/config";
import { useUserStore } from "src/stores/users";
import { useContactStore } from "src/stores/contacts";
import { onMounted, ref, watch, onBeforeUnmount } from "vue"; // Import onBeforeUnmount
import { CallNumber } from "@droponio/capacitor-call-number";
import useSpeechRecognition from "src/composable/useSpeechRecognition.composable"; // Import the composable
import { useGeolocation } from "src/composable/useGeolocation.composable";

const recognitionRestartAttempts = ref(0);
const maxRestartAttempts = 3;
const micStatusMessage = ref("");
const showMicStatus = ref(false);
const statusClass = ref("");
const configStore = useConfigStore();
const userStore = useUserStore();
const contactStore = useContactStore();
const {
  startRecognition,
  stopRecognition,
  recognizedText,
  isListening,
  recognitionError,
  permissionGranted,
} = useSpeechRecognition();

const { getExactAddress } = useGeolocation();

const listObj = ref({});
const currentAlarm = ref(null); // Declare currentAlarm ref
const isAlarmPlaying = ref(false); // Declare isAlarmPlaying ref

const soundOptions = [
  { label: "Sonido 1", sound: "alarma-1.mp3" },
  { label: "Sonido 2", sound: "alarma-2.mp3" },
  { label: "Sonido 3", sound: "alarma-3.mp3" },
  { label: "Sonido 4", sound: "alarma-4.mp3" },
  { label: "Sonido 5", sound: "alarma-5.mp3" },
  { label: "Sonido 6", sound: "alarma-6.mp3" },
];

const showStatus = (message, type = "info") => {
  micStatusMessage.value = message;
  showMicStatus.value = true;
  statusClass.value = `text-${type}`;

  setTimeout(() => {
    showMicStatus.value = false;
  }, 3000);
};

const levenshteinDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  const matrix = [];

  // Incremento a lo largo de la primera columna de cada fila
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }

  // Incremento a lo largo de la primera fila de cada columna
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  // Llenar la matriz
  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // sustitución
          Math.min(
            matrix[i][j - 1] + 1, // inserción
            matrix[i - 1][j] + 1 // eliminación
          )
        );
      }
    }
  }

  return matrix[s2.length][s1.length];
};

const toggleRecognition = async () => {
  if (isListening.value) {
    await stopRecognition();
    showStatus("Micrófono desactivado", "warning");
  } else {
    recognitionRestartAttempts.value = 0;
    await startRecognitionWithRetry();
  }
};

const startRecognitionWithRetry = async () => {
  if (recognitionRestartAttempts.value >= maxRestartAttempts) {
    showStatus("Error: Demasiados intentos fallidos", "negative");
    return;
  }

  try {
    await startRecognition();
    showStatus("Escuchando...", "positive");
  } catch (error) {
    recognitionRestartAttempts.value++;
    showStatus(`Error: ${error.message || error}`, "negative");

    // Reintentar después de 1 segundo
    setTimeout(() => {
      if (!isListening.value) {
        startRecognitionWithRetry();
      }
    }, 1000);
  }
};

watch(isListening, (newVal) => {
  if (!newVal) {
    // Intentar reiniciar automáticamente si se detuvo inesperadamente
    setTimeout(() => {
      if (
        !isListening.value &&
        permissionGranted.value &&
        !recognitionError.value
      ) {
        startRecognitionWithRetry();
      }
    }, 500);
  }
});

// Watcher para errores
watch(recognitionError, (newError) => {
  if (newError) {
    showStatus(`Error: ${newError.message || newError}`, "negative");
    // Intenta reiniciar el reconocimiento automáticamente
    if (isListening.value) {
      setTimeout(() => {
        startRecognition();
      }, 2000);
    }
  }
});

// Function to update listObj from configStore.list
const updateListObj = () => {
  listObj.value = configStore.list.reduce((acc, item) => {
    acc[item.value.toLowerCase()] = item;
    return acc;
  }, {});
};

// Watch for changes in configStore.list and update listObj
watch(
  () => configStore.list,
  () => {
    updateListObj();
  },
  { deep: true } // Deep watch to detect changes within the list items
);

onMounted(async () => {
  console.log("IndexPage.vue mounted.");
  if (userStore.current) {
    await configStore.getList(userStore.current.$id);
    await contactStore.getList(userStore.current.$id);
    updateListObj(); // Initial population
  }
});

// Stop recognition when navigating away from the page
onBeforeUnmount(() => {
  console.log("IndexPage.vue unmounted. Stopping recognition.");
  stopRecognition();
});

watch(recognizedText, async (newText) => {
  if (newText) {
    const normalizedText = newText.toLowerCase().trim();
    console.log("Comando reconocido:", normalizedText);

    // Buscar coincidencia exacta primero
    const exactMatch = Object.values(listObj.value).find((item) => {
      const command = item.command?.toLowerCase().trim();
      return command && normalizedText.includes(command);
    });

    if (exactMatch) {
      console.log("Coincidencia EXACTA encontrada:", exactMatch.value);
      executeCommand(exactMatch.value);
      recognizedText.value = "";
      return;
    }

    // Búsqueda aproximada si no hay coincidencia exacta
    const bestMatch = findBestMatch(normalizedText);
    if (bestMatch) {
      console.log("Coincidencia APROXIMADA encontrada:", bestMatch.value);
      executeCommand(bestMatch.value);
      recognizedText.value = "";
    }
  }
});

// Función para encontrar la mejor coincidencia aproximada
const findBestMatch = (text) => {
  let bestMatch = null;
  let bestScore = Infinity;

  for (const key in listObj.value) {
    const configItem = listObj.value[key];
    const command = configItem?.command?.toLowerCase().trim();

    if (command) {
      const distance = levenshteinDistance(text, command);
      const maxDistance = Math.min(3, Math.floor(command.length / 2));

      if (distance < bestScore && distance <= maxDistance) {
        bestScore = distance;
        bestMatch = configItem;
      }
    }
  }

  return bestMatch;
};

// Función para ejecutar comandos
const executeCommand = (commandType) => {
  switch (commandType.toLowerCase()) {
    case "llamada":
      makeCall();
      showStatus("Ejecutando: Llamada de emergencia", "positive");
      break;
    case "mensaje":
      sendSms();
      showStatus("Ejecutando: Mensaje de emergencia", "positive");
      break;
    case "alarma":
      playAlarm();
      showStatus("Ejecutando: Alarma de emergencia", "positive");
      break;
    case "general":
      playAlarm();
      makeCall();
      sendSms();
      showStatus("Ejecutando: Todas las acciones", "positive");
      break;
    default:
      console.warn("Comando no reconocido:", commandType);
  }
};

const sendSms = async () => {
  const smsConfig = listObj.value.mensaje;

  if (smsConfig && smsConfig.option_value) {
    let numbers = [];
    let messageText = "Mensaje de emergencia: Necesito ayuda.";

    try {
      const location = await getExactAddress();
      if (location) {
        messageText += ` Ubicación: ${location}`;
      }
    } catch (error) {
      console.error("Error al obtener la ubicación:", error);
      Notify.create({
        type: "negative",
        message: `Error al obtener la ubicación: ${error.message}. No se enviará el mensaje.`,
        position: "top",
      });
      return; // Stop execution if geolocation fails
    }

    if (smsConfig.option_value === "Todos los contactos") {
      numbers = contactStore.list.map((contact) => contact.telefono);
    } else {
      const selectedContact = contactStore.list.find(
        (contact) => contact.fullname.trim() === smsConfig.option_value.trim()
      );
      if (selectedContact) {
        numbers.push(selectedContact.telefono);
      }
    }

    if (numbers.length > 0) {
      try {
        if (SmsManager && SmsManager.send) {
          await SmsManager.send({
            numbers: numbers,
            text: messageText,
          });
          Notify.create({
            type: "positive",
            message: "Mensaje de emergencia enviado con éxito.",
            position: "top",
          });
        }
      } catch (error) {
        console.error("Error al enviar SMS:", error);
        Notify.create({
          type: "negative",
          message: `Error al enviar SMS: ${error.message}`,
          position: "top",
        });
      }
    } else {
      Notify.create({
        type: "warning",
        message: "No se encontraron contactos para enviar el mensaje.",
        position: "top",
      });
    }
  } else {
    Notify.create({
      type: "warning",
      message: "Configuración de mensaje no encontrada o incompleta.",
      position: "top",
    });
  }
};

const makeCall = async () => {
  const callConfig = listObj.value.llamada;

  if (callConfig && callConfig.option_value) {
    const selectedContact = contactStore.list.find(
      (contact) => callConfig.option_value.trim() === contact.fullname.trim()
    );

    if (selectedContact && selectedContact.telefono) {
      try {
        await CallNumber.call({
          number: selectedContact.telefono,
          bypassAppChooser: true, // Set to true to open the dialer app
        });
      } catch (error) {
        console.error("Error al intentar llamar:", error);
      }
    }
  }
};

const playAlarm = () => {
  if (isAlarmPlaying.value) {
    return;
  }

  const alarmConfig = listObj.value.alarma;

  if (alarmConfig && alarmConfig.option_value) {
    const selectedSound = soundOptions.find(
      (sound) => sound.label === alarmConfig.option_value
    );

    if (selectedSound) {
      const audio = new Audio(`/alarms/${selectedSound.sound}`);
      audio.loop = true;
      audio
        .play()
        .then(() => {
          currentAlarm.value = audio;
          isAlarmPlaying.value = true;
        })
        .catch((e) => {
          isAlarmPlaying.value = false;
        });
    }
  }
};

const stopAlarm = () => {
  if (currentAlarm.value) {
    currentAlarm.value.pause();
    currentAlarm.value.currentTime = 0; // Reset audio to start
    currentAlarm.value = null;
    isAlarmPlaying.value = false;
  }
};
</script>
