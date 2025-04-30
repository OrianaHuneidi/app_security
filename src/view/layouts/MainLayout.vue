<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-transparent">
      <q-toolbar
        v-if="
          ![
            '/contactos',
            '/configuraciones',
            '/informacion',
            '/inicio-sesion',
            '/registro',
            '/perfil',
          ].includes($route.path)
        "
      >
        <div class="fixed-left q-pa-md">
          <q-btn
            size="25px"
            class="!border !rounded-xl !p-2 !mt-2 !mr-2"
            color="black"
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />
        </div>

        <!-- <q-toolbar-title>
          orisecurity
        </q-toolbar-title> -->
      </q-toolbar>
    </q-header>
    <MenuMain />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import MenuMain from "@components/MenuMain.vue";
import menuComposable from "@composable/menu.composable.js";

const { toggleLeftDrawer } = menuComposable();
</script>
