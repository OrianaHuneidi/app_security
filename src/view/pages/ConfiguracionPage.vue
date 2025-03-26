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
    <div class="q-pa-md w-full">
<q-list class="q-gutter-md">
  <q-expansion-item
    popup
    default-opened
    label="Llamada"
    caption="Configuracion de llamadas"
    header-class="text-purple-6 text-[20px] border-1 border-purple-6"
    color="purple-6"
  >
    <q-separator color="purple-6"/>
    <q-card>
      <q-card-section class="q-pa-md">
        <q-item-label class="q-pb-md">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea,
          totam alias et ab minus nemo, deserunt eveniet maiores fugiat
          consectetur ipsam, harum sit neque. Quia laborum quisquam non.
          At, nostrum.
        </q-item-label>
        <q-input 
          v-model="text" 
          label="Comando de voz de llamada"
          color="purple-6"
          class="q-mb-md"
          standout="bg-purple-6 text-white"
        />
        <q-select
          v-model="model"
          :options="[1, 2, 3, 4, 5, 6, 7]"
          label="Standard"
          color="purple-6"
        />
      </q-card-section>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    popup
    label="Mensaje"
    caption="Configuracion de mensajes"
    header-class="text-purple-6  text-[20px] border-1 border-purple-6"
    color="purple-6"
  >
    <q-separator color="purple-6"/>
    <q-card>
      <q-card-section class="q-pa-md">
        <q-item-label class="q-pb-md">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea,
          totam alias et ab minus nemo, deserunt eveniet maiores fugiat
          consectetur ipsam, harum sit neque. Quia laborum quisquam non.
          At, nostrum.
        </q-item-label>
        <q-input 
          v-model="text" 
          label="Comando de voz de mensaje"
          color="purple-6"
          class="q-mb-md"
          standout="bg-purple-6 text-white"
        />
        <q-select
          v-model="model"
          :options="[1, 2, 3, 4, 5, 6, 7]"
          label="Standard"
          color="purple-6"
        />
      </q-card-section>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    popup
    label="Alarma"
    caption="Configuracion de alarmas"
    header-class="text-purple-6  text-[20px] border-1 border-purple-6"
    color="purple-6"
  >
    <q-separator color="purple-6"/>
    <q-card>
      <q-card-section class="q-pa-md">
        <q-item-label class="q-pb-md">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea,
          totam alias et ab minus nemo, deserunt eveniet maiores fugiat
          consectetur ipsam, harum sit neque. Quia laborum quisquam non.
          At, nostrum.
        </q-item-label>
        <q-input 
          v-model="text" 
          label="Comando de voz de alarmas"
          color="purple-6"
          class="q-mb-md"
          standout="bg-purple-6 text-white"
        />
        <q-select
          v-model="model"
          :options="[1, 2, 3, 4, 5, 6, 7]"
          label="Standard"
          color="purple-6"
        />
      </q-card-section>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    popup
    default-opened
    label="General"
    caption="Configuracion de todo en un comando"
    header-class="text-purple-6  text-[20px] border-1 border-purple-6"
    color="purple-6"
  >
    <q-separator color="purple-6"/>
    <q-card>
      <q-card-section class="q-pa-md">
        <q-item-label class="q-pb-md">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea,
          totam alias et ab minus nemo, deserunt eveniet maiores fugiat
          consectetur ipsam, harum sit neque. Quia laborum quisquam non.
          At, nostrum.
        </q-item-label>
        <q-input 
          v-model="text" 
          label="Comando de voz general"
          color="purple-6"
          standout="bg-purple-6 text-white"
        />
      </q-card-section>
    </q-card>
  </q-expansion-item>
</q-list>
    </div>
  </q-page>
</template>
<script setup>
import menuComposable from "@composable/menu.composable.js";
import { ref } from "vue";
const { toggleLeftDrawer } = menuComposable();
const model = ref(1);
const text = ref("");
</script>
