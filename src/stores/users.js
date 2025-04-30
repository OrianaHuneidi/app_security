import { account } from "@/services/account";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    current: null,
  }),
  actions: {
    register: async function (email, password, name) {
      return await account.create("unique()", email, password, name);
    },
    login: async function (email, password) {
      return await account
        .createEmailPasswordSession(email, password)
        .then(async () => {
          const user = await account.get();
          this.currentUser = user;
        });
    },
    logout: async function () {
      return await account.deleteSession("current").then(() => {
        this.$reset();
        this.current = null;
      });
    },

    getVerifySession: async function () {
      const session = await account.getSession("current").catch(() => null);

      if (session) {
        const user = await account.get();
        this.currentUser = user;
        return true;
      } else {
        this.current = null;
        return false;
      }
    },

    updateProfile: async function ({ name }) {
      try {
        // Actualizar nombre
        if (name && name !== this.currentUser.name) {
          await account.updateName(name);
        }

        // Obtener y actualizar datos del usuario
        const updatedUser = await account.get();
        this.currentUser = updatedUser;

        return {
          success: true,
          message: "Perfil actualizado correctamente",
          user: updatedUser,
        };
      } catch (error) {
        console.error("Error actualizando perfil:", error);
        throw new Error(error.message || "Error al actualizar el perfil");
      }
    },
    changePassword: async function ({ currentPassword, newPassword }) {
      try {
        // Validación básica antes de enviar a la API
        if (!currentPassword || !newPassword) {
          throw new Error("Todos los campos son requeridos");
        }

        // Actualizar contraseña usando Appwrite SDK
        await account.updatePassword(newPassword, currentPassword);

        // Forzar nuevo login si es necesario
        await this.getVerifySession();

        return {
          success: true,
          message: "Contraseña actualizada correctamente",
        };
      } catch (error) {
        console.error("Error cambiando contraseña:", error);

        // Mapear errores comunes de Appwrite
        let errorMessage = error.message;
        if (error.message.includes("Invalid password")) {
          errorMessage = "Contraseña actual incorrecta";
        } else if (error.message.includes("password")) {
          errorMessage = "La nueva contraseña no cumple los requisitos";
        }

        throw new Error(errorMessage);
      }
    },
  },
});
