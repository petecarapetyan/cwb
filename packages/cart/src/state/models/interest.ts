import { createModel } from '@captaincodeman/rdx'
import { State, Store  } from '../store'
import { createSelector } from 'reselect'
import { firestoreLoader } from "../firebase";

// dcmnt and clctn almost act like keywords, in this context
// They are also used as suffix, such as InterestDcmnt
// dcmnt (document) is used in this context as you would a record or a row in a database. Corresponds to `document` in firestore
// clctn (collection) is used in this context as you would a table in a database. Corresponds to a `collection` in firestore
// field, fields, type are used as document attributes, and corresponds to the elements of a schema as you would find in a database schema, as well as fields in a firestore document

export interface InterestDcmnt {
    id?: string,
    page: string,
    datetime: string,
    removedDatetime?: string,
    username?: string
}


// Please note that this default export of createModel() is re-exported
// as interest in ../ index.ts, then consumed by getState() below
// as state.interest.
// This could be confusing, even if it does make perfect sense, eventually
export default createModel({
  state: {
    focusDcmnt: {},
    interestClctn: {},
  },

  reducers: {
    interestClctn(state, interestClctn) {
      return { ...state, interestClctn };
    },
    focusDcmnt(state, focusDcmnt) {
      return { ...state, focusDcmnt };
    },
    upsert(state, dcmnt) {
      const interestClctn = state.interestClctn;
      interestClctn[dcmnt.id] = dcmnt;
      return { ...state, interestClctn };
    },
    deleteDcmnt(state, key: string) {
      const interestClctn = state.interestClctn;
      delete interestClctn[key];
      return { ...state, interestClctn };
    }

  },


  effects: (store: Store) => ({

    async readInShoppingCart() {
      const dispatch = store.getDispatch()
      const uid = store.getState().auth.user?.uid
      for (var i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i)
        if(key && key.startsWith("page")){
          const page:string = ""+localStorage.getItem(key)
          const datetime = ""+key.substr(13, key.length)
          if(!page?.startsWith("/README")){
            const data:InterestDcmnt = {
              page,
              datetime,
              username:`${uid}`,
              removedDatetime: ""
            };
            console.log("DATA", data)
            dispatch.interest.create(data)
          }
        }
      }
      localStorage.clear()
    },

    async create(data: InterestDcmnt) {
      const db = await firestoreLoader;
      db.collection("interest")
        .add({
          page: data.page,
          datetime: data.datetime,
          removedDatetime: data.removedDatetime,
          username: data.username,
        })
        .then(function (docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    },

    async delete(key: string) {
      const dispatch = store.getDispatch();
      const db = await firestoreLoader;
      if (!!key ) {
        const ref = db.collection("interest").doc(key)
        if (!!ref) {
            ref.delete()
            .then(function (_deleted) {
              console.log("Deleted ID: ", key);
              dispatch.interest.deleteDcmnt(key);
            })
            .catch(function (error) {
              console.error("Error adding document: ", error);
            });
          }
      } else {
        console.log("PETE YOU EFFED UP")
      }
    },

    async loadUpdateView(key: any) {
      const dispatch = store.getDispatch();
      const db = await firestoreLoader;
      let ref = db.collection("interest").doc(key);
        if (ref!!) {
          ref.get()
            .then(doc => {
              if (
                doc !== undefined &&
                doc.data() !== null &&
                doc.data() !== undefined
              ) {
              const data = doc.data();
                if (data != undefined) {
                  const dcmnt: InterestDcmnt = {
                    id: key,
                      page: data["page"],
                      datetime: data["datetime"],
                      removedDatetime: data["removedDatetime"],
                      username: data["username"],
                  };
                  window.location.replace("/interestU")
                  dispatch.interest.focusDcmnt(dcmnt);
                }
              }
            })
            .catch(err => {
              console.log('Error getting documents', err);
            });
        }
    },

    async updateDcmnt(data: InterestDcmnt) {
      const db = await firestoreLoader;
      const key: string = ""+data.id;
      if (!!key ) {
        const ref = db.collection("interest").doc(key)
        if (!!ref) {
            ref.update(data)
            .then(function (_key) {
              window.location.replace("/interestRD")
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
          }
      } else {
        console.log("PETE YOU EFFED UP")
      }
    },



  })
})

// see ../index.ts for where state.interest below,
// is defined using default export from above
const getState = (state: State) => state.interest

// creates methods such as `InterestSelectors.someval(state)`
// which would typically return state.someval
export namespace InterestSelectors {
  export const dcmntFocus = createSelector(
    [getState],
    (state) => state.focusDcmnt
  )
  export const interestClctn = createSelector(
    [getState],
    (state) => state.interestClctn
  )
}
