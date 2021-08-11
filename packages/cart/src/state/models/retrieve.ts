import { createModel } from "@captaincodeman/rdx";
import { Store, State } from "../store";
import { firestoreLoader } from "../firebase";
//REPLACEMENTS0
            import { InterestDcmnt } from "./interest"

// Please note that this default export of createModel() is re-exported
// as delta in ../ index.ts, then consumed by getState() below
// as state.delta.
// This could be confusing, even if it does make perfect sense, eventually

const allCollections: string[] = [
  //REPLACEMENTS1
            "interest",
            
            
];
export default createModel({
  state: {},

  reducers: {},

  effects: (store: Store) => ({
    async nullAllExcept(_running: string[]) {
      console.log(store)//to keep ts lint from complaining
      const db = await firestoreLoader;
      allCollections.forEach(collection => {
        if (!_running.includes(collection)) {
          let ref = db.collection(collection);
          if (ref!!) {
            ref.onSnapshot(() => {});
            console.log("DETACHING ", collection);
          }
        }
      });
    },

    // sure does seem like this below could be refactored if I wasn't too lazy
    //REPLACEMENTS2

            async interest() {
              const db = await firestoreLoader;
              let ref = db.collection("interest");
              if (ref!!) {
                const dispatch = store.getDispatch();
                dispatch.retrieve.nullAllExcept(["interest"]);
                ref.onSnapshot(snapshot => {
                  console.log("INSTANTIATING Interest");
                  let changes = snapshot.docChanges();
                  changes.forEach(change => {
                    if (change.type == "added") {
                      const ms = parseInt(change.doc.data()["datetime"])
                      const datetime = new Date(ms);
                      const dcmnt: InterestDcmnt = {
                        id: change.doc.id,
                        page: change.doc.data()["page"],
                        datetime: datetime.toISOString(),
                        removedDatetime: change.doc.data()["removedDatetime"],
                        username: change.doc.data()["username"],
                      };
                      dispatch.interest.upsert(dcmnt);
                    }
                    if (change.type == "removed") {
                      dispatch.interest.deleteDcmnt(change.doc.id);
                    }
                  });
                });
              }
            },        
            

  })
});

export const getState = (state: State) => state.retrieve;
