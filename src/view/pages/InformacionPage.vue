<template>
  <q-page>
    <h1
      class="!text-[20px] !font-medium !text-center !text-black !bg-[#ffa3ee] !p-0 !m-0 !leading-[70px]"
    >
      Información
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
    <div class="bg-white rounded-xl shadow-md p-6 mt-4">
      <p class="mb-4">
        <span class="text-[#e91e63] font-semibold">¡Bienvenida!</span> La
        aplicación MyMinder te permite gestionar protocolos de seguridad
        mediante
        <span class="text-[#e91e63] font-semibold">comandos naturales</span>.
        Con tecnología de
        <span class="text-[#e91e63] font-semibold">reconocimiento vocal</span>,
        puedes activar alarmas, enviar mensajes de emergencia y realizar
        llamadas con simples instrucciones verbales. Está diseñada para
        respuesta inmediata en situaciones críticas y su interfaz minimalista
        prioriza la
        <span class="text-[#e91e63] font-semibold">accesibilidad</span>,
        permitiendo operación
        <span class="text-[#e91e63] font-semibold">manos libres</span> en
        cualquier momento.
      </p>
      <h2 class="text-lg font-bold text-[#e91e63] mb-2">Centro de Ayuda</h2>
      <ol class="list-decimal list-inside space-y-3 text-base">
        <li>
          <span class="font-semibold text-[#e91e63]"
            >Configura tus comandos personalizados</span
          >
          <ul class="list-disc list-inside ml-4 mt-1 text-gray-700">
            <li>
              Registra
              <span class="text-[#e91e63] font-semibold">palabras clave</span>
              para acciones específicas (ej:
              <span class="text-[#e91e63]">"activar"</span>,
              <span class="text-[#e91e63]">"apagar"</span>).
            </li>
            <li>
              Selecciona un
              <span class="text-[#e91e63] font-semibold"
                >contacto prioritario</span
              >
              para los botones de llamada y mensaje.
            </li>
            <li>
              Elige un
              <span class="text-[#e91e63] font-semibold"
                >sonido predeterminado</span
              >
              para el botón de alarma.
            </li>
          </ul>
        </li>
        <li>
          <span class="font-semibold text-[#e91e63]">Activa el micrófono</span
          ><br />
          Otorga los permisos necesarios para que la aplicación pueda acceder al
          micrófono.
        </li>
        <li>
          <span class="font-semibold text-[#e91e63]">Di tu comando</span><br />
          Enuncia claramente las palabras clave que configuraste previamente,
          como:
          <ul class="list-disc list-inside ml-4 mt-1">
            <li><span class="text-[#e91e63] font-semibold">"ayuda"</span></li>
            <li><span class="text-[#e91e63] font-semibold">"peligro"</span></li>
            <li><span class="text-[#e91e63] font-semibold">"alarma"</span></li>
          </ul>
        </li>
        <li>
          <span class="font-semibold text-[#e91e63]">Confirma la acción</span
          ><br />
          Verifica que el sistema haya respondido correctamente mediante una
          señal visual o auditiva.
        </li>
        <li>
          <span class="font-semibold text-[#e91e63]">Corrige errores</span
          ><br />
          Si el sistema no reconoce tu comando:
          <ul class="list-disc list-inside ml-4 mt-1">
            <li>Repite la palabra o frase con claridad.</li>
            <li>
              Asegúrate de que la palabra esté registrada correctamente en la
              configuración.
            </li>
          </ul>
        </li>
      </ol>
    </div>
  </q-page>
</template>
<script setup>
import menuComposable from "@composable/menu.composable.js";

const { toggleLeftDrawer } = menuComposable();
</script>
