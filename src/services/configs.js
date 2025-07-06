import { ID, Query } from "appwrite";
import { databases } from "./db";
import { Loading, QSpinnerFacebook } from "quasar";

const configs = {
  id: "67fd57c20000fd9c367c",
  collectionId: "68288ed8000b8bb2383d",
};

export default {
  /** data: { value: string, command: string, option_value } */
  createdConfig: async function (data) {
    // if(data.value == "" || data.command == "") {
    //   throw new Error("Los campos no pueden estar vacios");
    // }

    Loading.show({ spinner: QSpinnerFacebook });

    return databases
      .createDocument(configs.id, configs.collectionId, ID.unique(), data)
      .finally(() => {
        Loading.hide();
      });
  },

  updatedConfig: async function (data) {
    if ((data.$id == "", data.user_id == "")) {
      throw new Error("Los campos no pueden estar vacios");
    }

    Loading.show({ spinner: QSpinnerFacebook });

    return databases
      .updateDocument(configs.id, configs.collectionId, data.$id, data)
      .finally(() => {
        Loading.hide();
      });
  },

  /** data: { limit: number, page: number, total: number } */
  getListConfigs: async function (user_id) {
    Loading.show({ spinner: QSpinnerFacebook });

    return databases
      .listDocuments(configs.id, configs.collectionId, [
        Query.equal("user_id", user_id),
      ])
      .finally(() => {
        Loading.hide();
      });
  },
};
