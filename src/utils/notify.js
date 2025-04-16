import { Dialog } from "quasar";

export default { 
    errorRequired: () => Dialog.create({
      title: "Error",
      message: "Por favor, completa todos los campos.",
      persistent: true,
    }),
    contactSaveSuccess: () => Dialog.create({
      title: "Éxito",
      message: "Contacto guardado exitosamente.",
      persistent: true,
    }),
    errorCatch: (message) => Dialog.create({
      title: "Error",
      message: message,
      persistent: true,
    }),

}