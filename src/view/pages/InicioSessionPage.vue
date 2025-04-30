<template>
  <div class="q-pa-md !w-full grid h-screen place-items-center">
    <form
      @submit.prevent.stop="onSubmit"
      @reset.prevent.stop="onReset"
      class="q-gutter-md"
    >
      <h1 class="text-center text-purple-8 text-h4">Inicio De Sesión</h1>

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
        <q-btn label="Iniciar sesión" type="submit" color="purple-8" />
        <q-btn
          label="Borrar"
          type="reset"
          color="purple-8"
          flat
          class="q-ml-sm"
        />
      </div>
      <div class="q-mt-sm text-center">
        ¿Aún no te has registrado?
        <router-link to="/registro" class="text-purple-8 text-weight-medium">
          Hazlo aquí
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useUserStore } from "src/stores/users";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { ref } from "vue";

const storeUser = useUserStore();
const router = useRouter();

const $q = useQuasar();

const email = ref("");
const emailRef = ref(null);

const password = ref("");
const passwordRef = ref(null);

const emailRules = [
  (val) => (val !== null && val !== "") || "Por favor, escriba su correo",
  (val) => /.+@.+\..+/.test(val) || "Por favor, ingrese un correo válido",
];

const passwordRules = [
  (val) => (val && val.length > 0) || "Por favor, escriba algo",
];

const onSubmit = () => {
  emailRef.value.validate();
  passwordRef.value.validate();

  if (emailRef.value.hasError || passwordRef.value.hasError) {
    return;
  } else {
    storeUser.login(email.value, password.value).then(() => {
      $q.notify({
        icon: "done",
        color: "positive",
        message: "Inicio de sesión exitoso",
      });

      setTimeout(() => router.push({ name: "panel" }), 200);

      onReset();
    });
  }
};

const onReset = () => {
  email.value = null;
  password.value = null;

  emailRef.value.resetValidation();
  passwordRef.value.resetValidation();
};
</script>
