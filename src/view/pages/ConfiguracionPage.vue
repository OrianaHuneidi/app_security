<template>
  <q-page>
    <h1
      class="!text-[20px] !font-medium !text-center !text-black !bg-[#ffa3ee] !p-0 !m-0 !leading-[70px]"
    >
      Configuración
    </h1>
    <div class="p-4">
      <q-btn
        size="25px"
        class="!border !rounded-xl !p-2 !mt-2 !mr-2 !z-50"
        color="black"
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />
    </div>
    <div class="w-full px-2">
      <q-list class="q-gutter-md">
        <q-expansion-item
          group="settingsGroup"
          popup
          label="Llamada"
          caption="Configuracion de llamadas"
          header-class="text-purple-6 text-[20px] border-1 border-purple-6"
          color="purple-6"
        >
          <q-separator color="purple-6" />
          <q-card>
            <q-card-section class="q-pa-md">
              <q-item-label class="q-pb-md">
                Porfavor escriba el comando de voz para llamar a su contacto, y
                elija una opcion de contacto.
              </q-item-label>
              <q-input
                v-model="call.text"
                label="Comando de voz de llamada"
                color="purple-6"
                class="q-mb-md"
                standout="bg-purple-6 text-white"
                @update:model-value="(val) => updateCommand(val, 'llamada')"
              />
              <q-select
                :options="call.selected.options"
                v-model="call.selected.value"
                label="Contactos"
                color="purple-6"
                standout="bg-purple-6 text-white"
                clearable
                @update:model-value="(val) => updateSelect(val, 'llamada')"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon name="call" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label caption>{{
                        scope.opt.data.telefono
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          group="settingsGroup"
          popup
          label="Mensaje"
          caption="Configuracion de mensajes"
          header-class="text-purple-6  text-[20px] border-1 border-purple-6"
          color="purple-6"
        >
          <q-separator color="purple-6" />
          <q-card>
            <q-card-section class="q-pa-md">
              <q-item-label class="q-pb-md">
                Porfavor escriba el comando de voz para enviar un mensaje, y
                elija una opcion de contacto.
              </q-item-label>
              <q-input
                v-model="sms.text"
                label="Comando de voz de mensaje"
                color="purple-6"
                class="q-mb-md"
                standout="bg-purple-6 text-white"
                @update:model-value="(val) => updateCommand(val, 'mensaje')"
              />
              <q-select
                :options="sms.selected.options"
                v-model="sms.selected.value"
                label="Contactos"
                color="purple-6"
                standout="bg-purple-6 text-white"
                clearable
                @update:model-value="(val) => updateSelect(val, 'mensaje')"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon name="person" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.label }}</q-item-label>
                      <q-item-label caption>{{
                        scope.opt.data.telefono
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          group="settingsGroup"
          label="Alarma"
          caption="Configuración de alarmas"
          header-class="text-purple-6 text-[20px] border-1 border-purple-6"
          color="purple-6"
          popup
        >
          <q-separator color="purple-6" />
          <q-card flat>
            <q-card-section class="q-pa-md">
              <div class="column q-gutter-y-md">
                <div class="text-caption text-grey-7">
                  Selecciona el comando de voz para alarmas y elige un sonido
                </div>

                <q-input
                  v-model="alarmCommand"
                  label="Comando de voz de alarma"
                  color="purple-6"
                  class="q-mb-md"
                  standout="bg-purple-6 text-white"
                  @update:model-value="(val) => updateCommand(val, 'alarma')"
                />

                <div class="row items-center q-gutter-sm">
                  <q-select
                    v-model="selectedSound"
                    :options="soundOptions"
                    label="Sonido de alarma"
                    color="purple-6"
                    standout="bg-purple-6 text-white"
                    clearable
                    class="col-grow"
                    @update:model-value="handleSoundChange"
                    options-dense
                  />
                  <q-btn
                    round
                    :icon="isPlaying ? 'pause' : 'play_arrow'"
                    :color="isPlaying ? 'negative' : 'accent'"
                    :disable="!selectedSound"
                    size="md"
                    @click="toggleSound"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          group="settingsGroup"
          popup
          label="General"
          caption="Configuracion de todo en un comando"
          header-class="text-purple-6  text-[20px] border-1 border-purple-6"
          color="purple-6"
        >
          <q-separator color="purple-6" />
          <q-card>
            <q-card-section class="q-pa-md">
              <q-item-label class="q-pb-md">
                Selecciona un comando de vos para activar todo al mismo tiempo.
              </q-item-label>
              <q-input
                v-model="general"
                label="Comando de voz general"
                color="purple-6"
                standout="bg-purple-6 text-white"
                @update:model-value="(val) => updateCommand(val, 'general')"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, toRaw, capitalize } from "vue";
import menuComposable from "@composable/menu.composable";
import { useContactStore } from "@stores/contacts";
import { useConfigStore } from "@stores/config";
import { debounce } from "@utils/general";
import { useUserStore } from "stores/users";

const { toggleLeftDrawer } = menuComposable();
const contactStore = useContactStore();
const configStore = useConfigStore();
const userStore = useUserStore();

// Configuración de sonidos
const soundOptions = [
  { label: "Sonido 1", sound: "alarma-1.mp3" },
  { label: "Sonido 2", sound: "alarma-2.mp3" },
  { label: "Sonido 3", sound: "alarma-3.mp3" },
  { label: "Sonido 4", sound: "alarma-4.mp3" },
  { label: "Sonido 5", sound: "alarma-5.mp3" },
  { label: "Sonido 6", sound: "alarma-6.mp3" },
];

const audioElement = ref(null); // Nueva referencia para el elemento de audio
const currentMediaId = null; // Eliminamos el control por mediaId
const isPlaying = ref(false);
const selectedSound = ref(null); // Nueva referencia para el sonido seleccionado
const alarmCommand = ref(""); // Comando de voz para alarmas
const general = ref("");

const listObj = ref({});

const call = reactive({
  text: "",
  selected: {
    value: "",
    options: [],
  },
});

const sms = reactive({
  text: "",
  selected: {
    value: "",
    options: [],
  },
});

const handleSoundChange = async () => {
  // Detenemos cualquier reproducción existente
  if (audioElement.value) {
    audioElement.value.pause();
    audioElement.value = null;
  }

  if (selectedSound.value) {
    try {
      // Construimos la ruta correcta para recursos estáticos
      const soundPath = `alarms/${selectedSound.value.sound}`;

      setTimeout(() => updateSelect(selectedSound.value, "alarma"), 200);

      // Creamos nuevo elemento de audio
      audioElement.value = new Audio(soundPath);
      audioElement.value.loop = true;

      // Manejador para error de carga
      audioElement.value.addEventListener("error", (e) => {
        console.error("Error de carga de audio:", e);
      });

      // Reproducimos después de la interacción del usuario
      const playPromise = audioElement.value.play();

      if (playPromise !== undefined) {
        await playPromise;
        isPlaying.value = true;
      }
    } catch (error) {
      console.error("Error de reproducción:", error);
      isPlaying.value = false;
    }
  }
};

const toggleSound = async () => {
  if (!selectedSound.value) return; // Asegurarse de que hay un sonido seleccionado

  if (!audioElement.value) {
    const soundPath = `alarms/${selectedSound.value.sound}`;
    audioElement.value = new Audio(soundPath);
    audioElement.value.loop = true;
    audioElement.value.addEventListener("ended", () => {
      isPlaying.value = false;
    });
    audioElement.value.addEventListener("pause", () => {
      isPlaying.value = false;
    });
    audioElement.value.addEventListener("play", () => {
      isPlaying.value = true;
    });
  }

  if (isPlaying.value) {
    audioElement.value.pause();
    isPlaying.value = false;
  } else {
    try {
      await audioElement.value.play();
      isPlaying.value = true;
    } catch (error) {
      console.error("Error al intentar reproducir el sonido:", error);
      isPlaying.value = false;
    }
  }
};

const updateCommand = debounce((command, key) => {
  if (!command) return;

  /**
    key: "llamada" | "mensaje" | "alarma"
    listObj.value= {llamada:{}, mensaje:{}, alarma:{}}
    listObj.value[key]
  */
  const option = listObj.value[key]; // { option_value, value, $id, command }

  if (option) {
    configStore.updateConfig({
      option_value: option.option_value,
      user_id: userStore.current.$id,
      value: option.value,
      $id: option.$id,
      command,
    });
  } else {
    configStore.addConfig({
      user_id: userStore.current.$id,
      option_value: "",
      value: capitalize(key),
      command,
    });
  }
}, 1000);

const updateSelect = (select, key) => {
  if (!select) return;

  const option = listObj.value[key]; // { option_value, value, $id, command }

  if (option) {
    configStore.updateConfig({
      user_id: userStore.current.$id,
      option_value: select.label,
      command: option.command,
      value: option.value,
      $id: option.$id,
    });
  } else {
    configStore.addConfig({
      user_id: userStore.current.$id,
      option_value: select.label,
      value: capitalize(key),
      command: "",
    });
  }
};

onMounted(() => {
  // Reproducir automáticamente el primer sonido al cargar
  if (audioElement.value) {
    audioElement.value.pause();
    audioElement.value = null;
  }

  contactStore.getList(userStore.current.$id).then(() => {
    const contactList = contactStore.list.map((contact) => ({
      label: contact.fullname,
      value: contact.$id,
      data: contact,
    }));

    call.selected.options = contactList;
    sms.selected.options = [
      ...contactList,
      {
        label: "Todos los contactos",
        value: "98193jasd9ij9",
        data: { telefono: "" },
      },
    ];
  });

  configStore.getList(userStore.current.$id).then(() => {
    // [{}] ==> {"nombre":{}}
    listObj.value = toRaw(configStore.list).reduce((acc, item) => {
      acc[item.value.toLowerCase()] = item;
      return acc;
    }, {});

    call.text = listObj.value.llamada?.command;
    call.selected.value = listObj.value.llamada?.option_value;

    sms.text = listObj.value.mensaje?.command;
    sms.selected.value = listObj.value.mensaje?.option_value;

    alarmCommand.value = listObj.value.alarma?.command;
    selectedSound.value =
      soundOptions.find(
        (sound) => sound.label === listObj.value.alarma?.option_value
      ) || null;

    general.value = listObj.value.general?.command;
  });
});

onUnmounted(async () => {
  if (currentMediaId) {
    await Media.stop({ mediaId: currentMediaId });
  }
});
</script>
