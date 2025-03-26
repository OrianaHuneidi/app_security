<template>
  <div class="q-pa-md !w-full grid h-screen place-items-center">
    <form
      @submit.prevent.stop="onSubmit"
      @reset.prevent.stop="onReset"
      class="q-gutter-md"
    >
      <q-input
        ref="nameRef"
        filled
        v-model="name"
        label="Name"
        lazy-rules
        :rules="nameRules"
        standout="bg-purple-6 text-white"
      />

      <q-input
        ref="ageRef"
        filled
        type="email"
        v-model="age"
        label="Correo"
        lazy-rules
        :rules="ageRules"
        standout="bg-purple-6 text-white"
      />

      <q-input
        ref="ageRef"
        filled
        type="password"
        v-model="age"
        label="Contraseña"
        lazy-rules
        :rules="ageRules"
        standout="bg-purple-6 text-white"
      />
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
      <router-link to="/registro" class="text-primary flex items-center">
        <q-icon name="person_add" class="q-mr-xs" />
        <span class="underline-on-hover">Regístrate</span>
      </router-link>
    </form>
  </div>
</template>
<script>
import { useQuasar } from "quasar";
import { ref } from "vue";

export default {
  setup() {
    const $q = useQuasar();

    const name = ref(null);
    const nameRef = ref(null);

    const age = ref(null);
    const ageRef = ref(null);

    const accept = ref(false);

    return {
      name,
      nameRef,
      nameRules: [
        (val) => (val && val.length > 0) || "Por favor, escriba algo",
      ],

      age,
      ageRef,
      ageRules: [
        (val) => (val !== null && val !== "") || "Por favor, escriba su correo",
        (val) => (val > 0 && val < 100) || "Please type a real age",
      ],

      accept,

      onSubmit() {
        nameRef.value.validate();
        ageRef.value.validate();

        if (nameRef.value.hasError || ageRef.value.hasError) {
          // form has error
        } else if (accept.value !== true) {
          $q.notify({
            color: "negative",
            message: "You need to accept the license and terms first",
          });
        } else {
          $q.notify({
            icon: "done",
            color: "positive",
            message: "Submitted",
          });
        }
      },

      onReset() {
        name.value = null;
        age.value = null;

        nameRef.value.resetValidation();
        ageRef.value.resetValidation();
      },
    };
  },
};
</script>
