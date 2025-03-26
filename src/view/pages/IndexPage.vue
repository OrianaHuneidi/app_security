<template>
  <q-page class="flex flex-center">
    <div class="flex flex-col items-center gap-6">
      <q-btn
        round
        align="right"
        color="pink"
        label="Llamada"
        size="18px"
        class="!rounded-full !mb-4 !py-4 !px-14 !bg-gradient-to-r !from-[#d1bef8] !to-[#8f2dff] !min-w-[200px] !pl-6 flex items-center justify-between !relative"
      >
        <template v-slot:default>
          <div class="absolute right-0 rounded-full bg-white mx-2">
            <q-icon class="text-[#8700ff] !p-2" name="call" size="30px" />
          </div>
        </template>
      </q-btn>
      <div>
        <q-btn
          color="primary"
          label="Mensaje"
          size="18px"
          class="!rounded-full !mb-4 !py-4 !px-14 !bg-gradient-to-r !from-[#fdbceb] !to-[#b740ff] !min-w-[200px] !pr-4 flex items-center justify-between !relative"
        >
          <template v-slot:default>
            <div class="absolute left-0 rounded-full bg-white mx-2">
              <q-icon class="text-[#ff60e1] !p-2" name="chat_bubble" size="30px" />
            </div>
          </template>
        </q-btn>
      </div>
      <q-btn
        color="primary"
        label="Alarma"
        size="18px"
        class="!rounded-full !py-4 !px-14 !bg-gradient-to-r !from-[#ffb5b5] !to-[#ff1717] !min-w-[200px] !pl-6 flex items-center justify-between !relative"
      >
        <template v-slot:default>
          <div class="absolute right-0 rounded-full bg-white mx-2">
          <q-icon class="text-[#ff1717] !p-2" name="notifications" size="30px" />
        </div>
        </template>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
//
</script>
