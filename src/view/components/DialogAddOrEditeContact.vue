<template>
  <q-dialog v-model="modelValue" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6" v-if="isEdit">Editar Contacto</div>
        <div class="text-h6" v-else>Agregar Contacto</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="form.fullname"
          label="Nombre y Apellido"
          autofocus
          :rules="[(value) => !!value || 'Campo requerido']"
          @update:model-value="
            (value) => (form.fullname = capitalizeFullName(value))
          "
        />
        <q-input
          v-model="form.telefono"
          label="Telefono"
          :rules="[(value) => !!value || 'Campo requerido']"
          mask="04## ###-####"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn
          flat
          label="Guardar"
          v-close-popup
          @click="accepted"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { capitalizeFullName } from "@utils/general";
import { reactive, watchEffect } from "vue";

const modelValue = defineModel("modelValue", {
  type: Boolean,
  default: false,
});

const emit = defineEmits(["save"]);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const form = reactive({
  fullname: "",
  telefono: "",
  $id: "",
});

const accepted = () => {
  emit("save", { ...form });
  clearForm();
}

watchEffect(() => {
  form.fullname = props.data.fullname;
  form.telefono = props.data.telefono;
  form.$id = props.data.$id;
});

function clearForm() {
  form.fullname = "";
  form.telefono = "";
  form.$id = "";
}
</script>
