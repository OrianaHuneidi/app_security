import { defineStore, acceptHMRUpdate } from 'pinia'
import contactosDb from 'src/services/contactos.js' 
import { SessionStorage } from 'quasar';

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
      })

      if (!response) {
        return this.list = SessionStorage.get('contacts');
      }
      
      this.list = response.documents;
      this.paginate.total = response.total;
    },
    async addContact(data) {
      await contactosDb.createdContact(data)
      .finally(() => this.getList());

      SessionStorage.set('contacts', this.list);
    },
    async deleteContact(id) {
      await contactosDb.removeContact(id)
      .finally(() => this.getList());

      SessionStorage.set('contacts', this.list);
    },
    async updateContact(data) {
      await contactosDb.updatedContact(data)
      .finally(() => this.getList());

      SessionStorage.set('contacts', this.list);
    },
  }
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useContactStore, import.meta.hot))
// }
