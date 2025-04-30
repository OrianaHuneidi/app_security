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
      flex
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
import { onMounted, reactive, unref } from "vue";
import notify from "@utils/notify.js";
import { SessionStorage } from "quasar";

const { toggleLeftDrawer } = menuComposable();
const contactStore = useContactStore();

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

function updateContact(contact) {
  contactStore
    .updateContact(contact)
    .then(() => {
      notify.contactUpdateSuccess();
    })
    .catch((error) => {
      notify.errorCatch(error.message);
    })
    .finally(() => {
      clearForm();
    });
}

function deleteContact(id) {
  contactStore
    .deleteContact(id)
    .then(() => {
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
    .addContact({ fullname: contact.fullname, telefono: contact.telefono })
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
  await contactStore.getList();
  if (contactStore.list.length != 0) {
    SessionStorage.set("contacts", contactStore.list);
  }
});
</script>
