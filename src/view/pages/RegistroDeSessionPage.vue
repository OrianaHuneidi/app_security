<template>
  <div class="q-pa-md !w-full grid h-screen place-items-center">
    <form
      @submit.prevent.stop="onSubmit"
      @reset.prevent.stop="onReset"
      class="q-gutter-md"
    >
      <h1 class="text-center text-purple-8 text-h4">Registro De Sesión</h1>
      <q-input
        ref="nameRef"
        filled
        v-model="name"
        label="Nombre"
        lazy-rules
        :rules="nameRules"
        standout="bg-purple-6 text-white"
      />

      <q-input
        ref="emailRef"
        filled
        type="email"
        v-model="email"
        label="Correo"
        lazy-rules
        :rules="emailRules"
        standout="bg-purple-6 text-white"
      />

      <q-input
        ref="passwordRef"
        filled
        type="password"
        v-model="password"
        label="Contraseña"
        lazy-rules
        :rules="passwordRules"
        standout="bg-purple-6 text-white"
      />
      <div>
        <q-btn label="Registrate" type="submit" color="purple-8" />
        <q-btn
          label="Borrar"
          type="reset"
          color="purple-8"
          flat
          class="q-ml-sm"
        />
      </div>
      <div class="q-mt-sm text-center">
        ¿Tienes una cuenta?
        <router-link
          to="/inicio-sesion"
          class="text-purple-8 text-weight-medium"
        >
          Inicia sesión aquí
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useUserStore } from "src/stores/users";
import { useQuasar } from "quasar";
import { ref } from "vue";

const storeUser = useUserStore();
const $q = useQuasar();

const name = ref(null);
const nameRef = ref(null);

const email = ref(null);
const emailRef = ref(null);

const password = ref(null);
const passwordRef = ref(null);

const nameRules = [
  (val) => (val && val.length > 0) || "Por favor, escriba algo",
];

const emailRules = [
  (val) => (val !== null && val !== "") || "Por favor, escriba su correo",
  (val) =>
    (val.includes("@") && val.includes(".")) ||
    "Por favor, escriba un correo válido",
];
const passwordRules = [
  (val) => (val && val.length > 0) || "Por favor, escriba algo",
];

const onSubmit = () => {
  nameRef.value.validate();
  emailRef.value.validate();
  passwordRef.value.validate();

  if (
    nameRef.value.hasError ||
    emailRef.value.hasError ||
    passwordRef.value.hasError
  ) {
    return;
  } else {
    storeUser
      .register(email.value, password.value, name.value)
      .then(() => {
        $q.notify({
          icon: "done",
          color: "positive",
          message: "Registro exitoso",
        });

        onReset();
      })
      .catch((error) => {
        $q.notify({
          icon: "warning",
          color: "negative",
          message: error.message,
        });
      });
  }
};

const onReset = () => {
  name.value = null;
  email.value = null;
  password.value = null;

  nameRef.value.resetValidation();
  emailRef.value.resetValidation();
  passwordRef.value.resetValidation();
};
</script>
