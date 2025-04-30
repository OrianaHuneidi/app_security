<template>
  <q-page class="q-pa-md">
    <div class="bg-primary w-full h-[360px] absolute top-0 left-0 z-0"></div>
    <div class="p-4 z-10">
      <q-btn
        size="25px"
        class="!border !rounded-xl !p-2 !mt-2 !mr-2 !z-50 relative"
        color="black"
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      />
    </div>
    <h1
      class="!text-[30px] !w-full text-black !font-medium !text-center !px-20 !m-0 !leading-[45px] z-10 relative !-mt-[85px]"
      black
    >
      Perfil de Usuario
    </h1>

    <div class="row q-col-gutter-md justify-center !mt-3 z-10 relative">
      <q-avatar size="130px" class="mb-5 w-full">
        <img
          :src="`https://placehold.co/600x600/white/8F2DFF/?text=${name
            .split(' ')
            .map((n, i) => (i < 2 ? n[0].toLocaleUpperCase() : ''))
            .join('')}`"
        />
      </q-avatar>

      <!-- Formulario de Información Básica -->
      <div class="col-12 col-md-6 text-center">
        <div class="text-purple-9 w-full inline-block text-2xl -mr-8 underline">
          {{ name }}
          <q-icon
            name="edite"
            size="20px"
            color="text-purple-9"
            class="inline ml-2"
            @click="dialogs.basic.toggle()"
          />
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="mt-10 px-10">
          <b class="text-2xl text-primary">Email</b>

          <div
            class="text-[#737373] w-full inline-block text-xl mt-3 underline"
          >
            {{ email }}
          </div>
        </div>

        <div class="w-full flex justify-center items-center mt-5">
          <q-btn
            label="Cambiar contraseña"
            class="!mt-4 text-purple-9 bg-accent"
            unelevated
            @click="dialogs.password.toggle()"
          />
        </div>
      </div>

      <q-dialog v-model="dialogs.basic.value">
        <div class="col-12 col-md-6 mt-10 bg-white">
          <q-btn
            icon="close"
            flat
            round
            dense
            class="float-right z-20"
            @click="dialogs.basic.toggle()"
          />
          <q-form
            @submit.prevent="onSubmitProfile"
            class="q-gutter-md py-14 px-4"
          >
            <h2 class="text-h5 text-center text-primary">Información Basica</h2>
            <q-input
              ref="nameRef"
              filled
              v-model="name"
              label="Nombre completo"
              lazy-rules
              :rules="nameRules"
            />

            <q-input
              filled
              type="email"
              v-model="email"
              label="Correo electrónico"
              :disable="true"
            />

            <div class="flex justify-center q-gutter-sm">
              <q-btn label="Actualizar datos" type="submit" color="primary" />
              <q-btn
                label="Limpiar"
                type="reset"
                color="primary"
                flat
                @click="onResetProfile"
              />
            </div>
          </q-form>
        </div>
      </q-dialog>

      <q-dialog v-model="dialogs.password.value">
        <!-- Formulario de Cambio de Contraseña -->
        <div class="col-12 col-md-6 mt-10 bg-white">
          <q-btn
            icon="close"
            flat
            round
            dense
            class="float-right z-20"
            @click="dialogs.password.toggle()"
          />
          <q-form
            @submit.prevent="onSubmitPassword"
            class="q-gutter-md py-14 px-4"
          >
            <h2 class="text-h5 text-center text-primary">Cambiar Contraseña</h2>

            <q-input
              ref="currentPasswordRef"
              filled
              type="password"
              v-model="currentPassword"
              label="Contraseña actual"
              lazy-rules
              :rules="passwordRules"
              standout="bg-purple-6 text-white"
            />

            <q-input
              ref="newPasswordRef"
              filled
              type="password"
              v-model="newPassword"
              label="Nueva contraseña"
              lazy-rules
              :rules="passwordRules"
              standout="bg-purple-6 text-white"
            />

            <q-input
              ref="repeatPasswordRef"
              filled
              type="password"
              v-model="repeatPassword"
              label="Repetir nueva contraseña"
              lazy-rules
              :rules="repeatPasswordRules"
              standout="bg-purple-6 text-white"
            />

            <div class="flex justify-center q-gutter-sm">
              <q-btn
                label="Cambiar contraseña"
                type="submit"
                unelevated
                color="primary"
              />
              <q-btn
                color="primary"
                label="Limpiar"
                type="reset"
                unelevated
                flat
                @click="onResetPassword"
              />
            </div>
          </q-form>
        </div>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useQuasar } from "quasar";
import menuComposable from "@composable/menu.composable.js";
import { useUserStore } from "src/stores/users";

const { toggleLeftDrawer } = menuComposable();
const storeUser = useUserStore();
const $q = useQuasar();

// Datos del perfil
const name = ref("");
const email = ref("");

// Referencias de validación
const nameRef = ref(null);

const dialogs = reactive({
  basic: {
    value: false,
    toggle: () => (dialogs.basic.value = !dialogs.basic.value),
  },
  password: {
    value: false,
    toggle: () => (dialogs.password.value = !dialogs.password.value),
  },
});

// Reglas de validación
const nameRules = [
  (val) => !!val || "El nombre es requerido",
  (val) => val.length >= 3 || "Mínimo 3 caracteres",
];

// Datos para cambio de contraseña
const currentPassword = ref("");
const newPassword = ref("");
const repeatPassword = ref("");

// Referencias de validación de contraseña
const currentPasswordRef = ref(null);
const newPasswordRef = ref(null);
const repeatPasswordRef = ref(null);

// Reglas de validación de contraseña
const passwordRules = [
  (val) => !!val || "La contraseña es requerida",
  (val) => val.length >= 6 || "Mínimo 6 caracteres",
];

const repeatPasswordRules = [
  ...passwordRules,
  (val) => val === newPassword.value || "Las contraseñas no coinciden",
];

// Cargar datos del usuario al montar el componente
onMounted(() => {
  const currentUser = storeUser.currentUser;
  if (currentUser) {
    name.value = currentUser.name;
    email.value = currentUser.email;
  }
});

// Manejo del formulario de perfil
const onSubmitProfile = async () => {
  const validation = await Promise.all([nameRef.value.validate()]);

  if (validation.some((v) => v === false)) return;

  try {
    await storeUser.updateProfile({
      name: name.value,
    });

    $q.notify({
      color: "positive",
      message: "Datos actualizados correctamente",
    });
  } catch (error) {
    $q.notify({
      color: "negative",
      message: error.message || "Error al actualizar los datos",
    });
  }
};

const onResetProfile = () => {
  name.value = storeUser.currentUser.name;
  nameRef.value.resetValidation();
};

// Manejo del formulario de contraseña
const onSubmitPassword = async () => {
  const validation = await Promise.all([
    currentPasswordRef.value.validate(),
    newPasswordRef.value.validate(),
    repeatPasswordRef.value.validate(),
  ]);

  if (validation.some((v) => v === false)) return;

  try {
    await storeUser.changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });

    $q.notify({
      color: "positive",
      message: "Contraseña actualizada correctamente",
    });
    onResetPassword();
  } catch (error) {
    $q.notify({
      color: "negative",
      message: error.message || "Error al cambiar la contraseña",
    });
  }
};

const onResetPassword = () => {
  currentPassword.value = "";
  newPassword.value = "";
  repeatPassword.value = "";
  currentPasswordRef.value.resetValidation();
  newPasswordRef.value.resetValidation();
  repeatPasswordRef.value.resetValidation();
};
</script>
