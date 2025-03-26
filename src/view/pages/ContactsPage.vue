<template>
  <q-page>
    <h1
      class="!text-[20px] !font-medium !text-center !text-black !bg-[#ffa3ee] !p-0 !m-0 !leading-[70px]"
    >
      Contactos
    </h1>
    <div class="p-4">
     <q-btn size="25px" class="!border !rounded-xl !p-2 !mt-2 !mr-2 !z-50" color="black" flat dense round icon="menu"aria-label="Menu" @click="toggleLeftDrawer" />
    </div>
    <div>
      <q-list  class="!py-4">
        <q-item class="flex items-start">
          <!-- Icono con margen derecho -->
          <q-icon
            name="account_circle"
            size="30px"
            class="text-[#8700ff] mr-3"
          />

          <!-- Contenedor de texto -->
          <div class="flex-grow">
            <div class="text-gray-600 font-medium">Nombre y Apellido</div>
            <div class="text-caption text-gray-400 mt-1">Numero</div>
          </div>
          <!-- Icono con margen derecho -->
          <q-icon name="edit" size="30px" class="text-black mr-3" />
        </q-item>

        <!-- Contacto 2 -->
        <q-item class="flex items-start">
          <!-- Icono con margen derecho -->
          <q-icon
            name="account_circle"
            size="30px"
            class="text-[#8700ff] mr-3"
          />

          <!-- Contenedor de texto -->
          <div class="flex-grow">
            <div class="text-gray-600 font-medium">Nombre y Apellido</div>
            <div class="text-caption text-gray-400">Numero</div>
          </div>
          <q-icon name="edit" size="30px" class="text-black mr-3" />
        </q-item>

        <!-- Espacio final -->
      </q-list>
    </div>

    <div class="absolute-full flex justify-center items-end p-6">
      <q-btn
        round
        icon="add"
        size="lg"
        class="!bg-[#8700ff] !text-white !shadow-xl"
      />
    </div>
  </q-page>
</template>

<script setup>
import menuComposable from '@composable/menu.composable.js'

const { toggleLeftDrawer } = menuComposable()
</script>