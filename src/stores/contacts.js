import { defineStore, acceptHMRUpdate } from 'pinia'
import contactosDb from 'src/services/contactos.js' 

export const useContactStore = defineStore('contact', {
  state: () => ({
    current: null,
    list: [],
    paginate: {
      page: 1,
      limit: 10,
      total: 0
    }
  }),

  actions: {
    async getList() {
      const response = await contactosDb.getListContacts({
        paginate: this.paginate
      });
      this.list = response.documents;
      this.paginate.total = response.total;
    },
    async addContact(data) {
      await contactosDb.createdConect(data)
      .finally(() => this.getList());
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useContactStore, import.meta.hot))
}
