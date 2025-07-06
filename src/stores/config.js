import { defineStore } from "pinia";
import configsService from "@services/configs";
import { SessionStorage } from "quasar";

export const useConfigStore = defineStore("config", {
  state: () => ({
    list: [],
    isLoaded: false, // Add a flag to indicate if config data has been loaded
  }),

  actions: {
    async getList(user_id) {
      if (this.isLoaded && this.list.length > 0) {
        return; // Data already loaded, no need to fetch again
      }

      const response = await configsService.getListConfigs(user_id);

      if (!response) {
        this.list = SessionStorage.get("configs");
        this.isLoaded = true; // Set flag even if from session storage
        return;
      }

      this.list = response.documents;
      this.isLoaded = true; // Set flag to true after successful load
    },
    async addConfig(data) {
      await configsService
        .createdConfig(data)
        .finally(() => this.getList(data.user_id));

      SessionStorage.set("configs", this.list);
      this.isLoaded = true; // Ensure flag is set after add
    },
    // async deleteConfig(id, user_id) {
    //   await configsService
    //     .removeConfig(id)
    //     .finally(() => this.getList(user_id));

    //   SessionStorage.set("configs", this.list);
    // },
    async updateConfig(data) {
      await configsService
        .updatedConfig(data)
        .finally(() => this.getList(data.user_id));

      SessionStorage.set("configs", this.list);
      this.isLoaded = true; // Ensure flag is set after update
    },
  },
});

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useConfigStore, import.meta.hot))
// }
