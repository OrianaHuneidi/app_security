<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    bordered
    side="right"
    :width="viewportWidth"
    class="!bg-white !z-[10000] !absolute"
  >
    <!-- Icono de cierre (X) -->
    <q-btn
      icon="close"
      flat
      round
      dense
      class="absolute-top-right q-ma-md"
      @click="leftDrawerOpen = false"
      size="lg"
    />

    <q-list class="q-pt-xl">
      <!-- Espacio para el icono -->
      <EssentialLink
        v-for="link in linksList"
        :key="link.title"
        v-bind="link"
      />
      <div class="!flex !items-center !justify-center w-full fixed !bottom-15">
        <q-btn
          label="Inicio de sesión"
          flat
          no-caps
          round
          dense
          class="!rounded-full !mb-4 !px-6 !bg-gradient-to-r !bg-[#ffa3ee] !min-w-[20px] !pl-6"
          size="lg"
          to="/inicio-sesion"
        />
      </div>
    </q-list>
  </q-drawer>
</template>

<script setup>
import EssentialLink from "@components/EssentialLink.vue";
import menuComposable from "@composable/menu.composable.js";
import { ref } from "vue";
const { leftDrawerOpen } = menuComposable();

const linksList = [
  {
    title: "Inicio",
    caption: "",
    icon: "",
    link: "/",
  },
  {
    title: "Configuraciones",
    caption: "",
    icon: "",
    link: "/configuraciones",
  },
  {
    title: "Contactos",
    caption: "",
    icon: "",
    link: "/contactos",
  },
  {
    title: "Información",
    caption: "",
    icon: "",
    link: "/informacion",
  },
];

const viewportWidth = ref(window.innerWidth);
// Ejemplo: 1200 (depende del zoom o tamaño de ventana)
// Obtener y mostrar el ancho actual
function getWindowWidth() {
  viewportWidth.value = window.innerWidth;
}

// Escuchar cambios de tamaño
window.addEventListener("resize", getWindowWidth);

// Ejecutar al cargar
getWindowWidth();
</script>
