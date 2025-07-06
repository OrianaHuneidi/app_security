<template>
  <q-page>
    <h1
      class="!text-[20px] !font-medium !text-center !text-black !bg-[#ffa3ee] !p-0 !m-0 !leading-[70px]"
    >
      Contactos
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
    <div>
      <q-list class="!py-4">
        <q-item
          class="flex items-start"
          v-for="(contact, index) in contactStore.list"
          :key="index"
        >
          <!-- Icono con margen derecho -->
          <q-icon
            name="account_circle"
            size="30px"
            class="text-[#8700ff] mr-3"
          />

          <!-- Contenedor de texto -->
          <div class="flex-grow">
            <div class="text-gray-600 font-medium">{{ contact.fullname }}</div>
            <div class="text-caption text-gray-400 mt-1">
              {{ contact.telefono }}
            </div>
          </div>
          <!-- Icono con margen derecho -->
          <q-icon
            name="edit"
            size="30px"
            class="text-black mr-3"
            @click="editeContact(contact)"
          />
          <q-icon
            name="delete"
            size="30px"
            class="text-black mr-3"
            @click="deleteContact(contact.$id)"
          />
        </q-item>
      </q-list>
    </div>

    <q-btn
      round
      icon="add"
      size="lg"
      class="!bg-[#8700ff] !text-white !shadow-xl fixed !bottom-4 !left-[calc(50%-28px)] !z-50"
      @click="addContact()"
    />

    <DialogAddOrEditeContact
      v-model="dialgos.addOrEditeContact.value"
      :is-edit="mode.edite.value"
      :data="form"
      @save="
        (data) => (mode.edite.value ? updateContact(data) : saveContact(data))
      "
    />
  </q-page>
</template>

<script setup>
import DialogAddOrEditeContact from "@components/DialogAddOrEditeContact.vue";
import menuComposable from "@composable/menu.composable.js";
import { useContactStore } from "@stores/contacts.js";
import { useUserStore } from "@stores/users.js";
import { useConfigStore } from "@stores/config"; // Import useConfigStore
import { onMounted, reactive, unref } from "vue";
import notify from "@utils/notify.js";
import { SessionStorage } from "quasar";

const { toggleLeftDrawer } = menuComposable();
const contactStore = useContactStore();
const userStore = useUserStore();
const configStore = useConfigStore(); // Initialize configStore

const form = reactive({
  $id: "",
  fullname: "",
  telefono: "",
});

const dialgos = reactive({
  addOrEditeContact: {
    value: false,
    toggle: () =>
      (dialgos.addOrEditeContact.value = !dialgos.addOrEditeContact.value),
  },
});

const mode = reactive({
  edite: {
    value: false,
    toggle: () => (mode.edite.value = !mode.edite.value),
  },
});

function editeContact(contact) {
  mode.edite.value = true;
  form.fullname = contact.fullname;
  form.telefono = contact.telefono;
  form.$id = contact.$id;
  dialgos.addOrEditeContact.toggle();
}

function addContact() {
  mode.edite.value = false;
  form.fullname = "";
  form.telefono = "";
  form.$id = "";
  dialgos.addOrEditeContact.toggle();
}

async function updateContact(contact) {
  const oldFullname = form.fullname; // Get the old fullname before update

  await contactStore
    .updateContact({ ...contact, user_id: userStore.current.$id })
    .then(async () => {
      // After contact is updated, update related configs
      await configStore.getList(userStore.current.$id); // Ensure configs are fresh
      for (const config of configStore.list) {
        if (
          (config.value === "Llamada" || config.value === "Mensaje") &&
          config.option_value === oldFullname
        ) {
          await configStore.updateConfig({
            ...config,
            option_value: contact.fullname, // Update to new fullname
          });
        }
      }
      notify.contactUpdateSuccess();
    })
    .catch((error) => {
      notify.errorCatch(error.message);
    })
    .finally(() => {
      clearForm();
    });
}

async function deleteContact(id) {
  const deletedContact = contactStore.list.find((c) => c.$id === id);
  if (!deletedContact) {
    notify.errorCatch("Contacto no encontrado para eliminar.");
    return;
  }

  await contactStore
    .deleteContact(id, userStore.current.$id)
    .then(async () => {
      // After contact is deleted, clear related configs
      await configStore.getList(userStore.current.$id); // Ensure configs are fresh
      for (const config of configStore.list) {
        if (
          (config.value === "Llamada" || config.value === "Mensaje") &&
          config.option_value === deletedContact.fullname
        ) {
          await configStore.updateConfig({
            ...config,
            option_value: "", // Clear the option value
            command: config.command || "", // Keep command or set to empty
          });
        }
      }
      notify.contactDeleteSuccess();
    })
    .catch((error) => {
      notify.errorCatch(error.message);
    });
}

async function saveContact(contact) {
  if (!contact.fullname || !contact.telefono) {
    notify.errorRequired();
    return;
  }
  await contactStore
    .addContact({
      fullname: contact.fullname,
      telefono: contact.telefono,
      user_id: userStore.current.$id,
    })
    .then(() => {
      notify.contactSaveSuccess();
    })
    .catch((error) => {
      notify.errorCatch(error.message);
    })
    .finally(() => {
      clearForm();
    });
}

function clearForm() {
  form.fullname = "";
  form.telefono = "";
  form.$id = "";
}

onMounted(async () => {
  await contactStore.getList(userStore.current.$id);
  if (contactStore.list.length != 0) {
    SessionStorage.set("contacts", contactStore.list);
  }
});
</script>
