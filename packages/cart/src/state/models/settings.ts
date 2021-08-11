import { createModel } from "@captaincodeman/rdx";
import { firestoreLoader } from "../firebase";

export default createModel({
  state: {
    gtmId: "",
  },
  reducers: {
    gtmId(state, gtmId) {
      return { ...state, gtmId };
    },
  },
  effects: (store) => ({
    async readGtmId() {
      const dispatch = store.getDispatch();
      const db = await firestoreLoader;
      const ref = db.doc("admin/settings");
      const snapshot: any = await ref.get();
      const data = snapshot.data();
      dispatch.settings.gtmId(data.gtmId);
    },

    async updateGtmId(id: string) {
      const db = await firestoreLoader;
      const ref = db.doc("admin/settings");
      ref.set({ gtmId: id }, { merge: true });
    },
  }),
});
