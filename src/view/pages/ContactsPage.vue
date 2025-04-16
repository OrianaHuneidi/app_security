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
            @click="editContact(index)"
          />
          <q-icon
            name="delete"
            size="30px"
            class="text-black mr-3"
            @click="deleteContact(index)"
          />
        </q-item>
      </q-list>
    </div>

    <q-btn
      round
      icon="add"
      size="lg"
      class="!bg-[#8700ff] !text-white !shadow-xl fixed !bottom-4 !left-[calc(50%-28px)] !z-50"
      @click="dialgos.newContact.toggle()"
    />

    <q-dialog v-model="dialgos.newContact.value" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Agregar Contacto</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="form.fullname"
            label="Nombre y Apellido"
            autofocus
            :rules="['required']"
            @update:model-value="
              (value) => (form.fullname = capitalizeFullName(value))
            "
          />
          <q-input
            v-model="form.telefono"
            label="Telefono"
            :rules="['required']"
            mask="04## ###-####"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup @click="clearForm" />
          <q-btn flat label="Guardar" v-close-popup @click="saveContact" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import menuComposable from "@composable/menu.composable.js";
import { useContactStore } from "@stores/contacts.js";
import { capitalizeFullName } from "@utils/general";
import { onMounted, reactive, unref } from "vue";
import notify from "@utils/notify.js";

const { toggleLeftDrawer } = menuComposable();
const contactStore = useContactStore();

const form = reactive({
  fullname: "",
  telefono: "",
});

const dialgos = reactive({
  newContact: {
    value: false,
    toggle: () => (dialgos.newContact.value = !dialgos.newContact.value),
  },
});

function editContact(index) {
  // Aquí puedes agregar lógica adicional para editar el contacto, como abrir un formulario de edición
  // o realizar una llamada a una API para actualizar el contacto en una base de datos.
  // Por ejemplo, podrías usar un prompt para editar el nombre:
  const newName = prompt("Editar nombre:", contact.name);
  if (newName !== null) {
    contact.name = newName;
    alert("Contacto editado exitosamente.");
  }
}

function deleteContact(index) {
  // Aquí puedes agregar lógica adicional para eliminar el contacto, como mostrar un mensaje de confirmación
  // o realizar una llamada a una API para eliminar el contacto de una base de datos.
  // Por ejemplo, podrías usar un alert para confirmar la eliminación:
  console.log("Contacto eliminado exitosamente.", index);
}

async function saveContact() {
  if (!form.fullname || !form.telefono) {
    notify.errorRequired();
    return;
  }
  await contactStore
    .addContact(unref(form))
    .then(() => {
      notify.contactSaveSuccess();
      clearForm();
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
}

onMounted(async () => {
  await contactStore.getList();
});
</script>
