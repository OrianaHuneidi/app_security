<template>
  <q-page>
    <h1
      class="!text-[20px] !font-medium !text-center !text-black !bg-[#ffa3ee] !p-0 !m-0 !leading-[70px]"
    >
        Información
    </h1>
    <div class="p-4">
     <q-btn size="25px" class="!border !rounded-xl !p-2 !mt-2 !mr-2 !z-50" color="black" flat dense round icon="menu"aria-label="Menu" @click="toggleLeftDrawer" />
    </div>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque quos quas accusantium autem temporibus debitis ea voluptatibus! Soluta, ratione? Tempore nesciunt totam earum et aut omnis odit ipsum at exercitationem.</p>
  </q-page>
</template>
<script setup>
import menuComposable from '@composable/menu.composable.js'

const { toggleLeftDrawer } = menuComposable()
</script>