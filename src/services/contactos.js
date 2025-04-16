import { ID, Query } from "appwrite";
import { databases } from "./db";
import { Loading, QSpinnerFacebook } from "quasar";

const contactos = {
  id: "67fd57c20000fd9c367c",
  collectionId: "67fd57ce0019e1e0510c",
};

export default {
  /** data: { fullname: string, telefono: string } */
  createdConect: async function (data) {
    if(data.fullname == "" || data.telefono == "") {
      throw new Error("Los campos no pueden estar vacios");
    }

    Loading.show({
        spinner: QSpinnerFacebook,
    });

    return databases
      .createDocument(contactos.id, contactos.collectionId, ID.unique(), data)
      .finally(() => {
        Loading.hide();
      });
  },

  /** data: { limit: number, page: number, total: number } */
  getListContacts: async function (paginate) {
    const limit = paginate.limit || 10;
    const page = (paginate.page || 1)

    Loading.show({
        spinner: QSpinnerFacebook,
    });
    return databases
      .listDocuments(contactos.id, contactos.collectionId, [
        Query.limit(limit),
        Query.offset(page - 1),
      ])
      .finally(() => {
        Loading.hide();
      })
  },
};
